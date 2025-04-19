

import { CheerioCrawler, Dataset } from 'crawlee';
import { setTimeout } from 'timers/promises';
import MongoDBWrapper from "../lib/mongoDBWrapper.js";

// Define the base URL
const BASE_URL = 'https://www.osha.gov/laws-regs/standardinterpretations/publicationdate';
const COLLECTION_NAME = 'publications';

// Create a structure to store our publications
const publications = [];
let publicationCounter = 0;

let collection;
// Initialize MongoDB client
const mongo = new MongoDBWrapper()

// Initialize the crawler
const crawler = new CheerioCrawler({
    // Set a reasonable request rate to avoid overloading the server
    maxRequestsPerMinute: 20,

    // Handle each page
    async requestHandler({ request, $, enqueueLinks }) {
        console.log(`Processing: ${request.url}`);

        // Check if we're on the main listing page or a publication page
        if (request.url.includes('/standardinterpretations/publicationdate')) {

            console.log('Processing listing page...');

            // Find all publication links on the current page
            const publicationLinks = $('.view-content li a');
            console.log(`Found ${publicationLinks.length} publications on this page`);

            // Enqueue each publication for detailed scraping
            await enqueueLinks({
                selector: '.view-content li a',
                label: 'detail',
            });

            // Check if there's a next page and enqueue it
            const nextPageLink = $('.pager__item--next a').attr('href');
            if (nextPageLink) {
                const nextPageUrl = new URL(nextPageLink, BASE_URL).href;
                console.log(`Enqueueing next page: ${nextPageUrl}`);
                await crawler.addRequests([{ url: nextPageUrl }]);
            }
        } else if (request.label === 'detail') {
            // We're on a publication detail page
            console.log('Processing publication detail page...');

            // Extract publication details
            const title = $('#breadcrumbs-container li.active').text().trim();

            // Extract publication date
            let pubDate = request.url.match(/[^\/]+$/).toString()

            // Extract standard number
            let standardNumber = [];
            $('.field--name-field-fr-standard-number a').each(function() {
                standardNumber.push($(this).text().trim());
            });

            // Extract content text
            let contentText = '';
            $('article .field--name-body').each(function() {
                contentText = $(this).text().trim();
            });

            // Create publication object
            const publication = {
                title,
                url: request.url,
                publicationDate: pubDate,
                standardNumber: standardNumber || [],
                content: contentText,
                scrapedAt: new Date()
            };

            // Add to our local array
            publications.push(publication);
            publicationCounter++;

            console.log(`Scraped: ${title} [Total: ${publicationCounter}]`);

            // Save to MongoDB after every 100 records
            if (publicationCounter % 10 === 0) {
                const batch = publications.slice(publications.length - 100);
                await mongo.bulkUpsert("publications", batch);
                console.log(`Saved batch of ${batch.length} publications to MongoDB`);
            }

            // Add a small delay between requests to be respectful
            await setTimeout(1000);
        }
    },

    // Handle failures
    failedRequestHandler({ request }) {
        console.log(`Request ${request.url} failed`);
    },
});

// Main function to run the crawler
export async function runCrawler() {


    // Add the starting URL to the crawler
    await crawler.addRequests([{ url: BASE_URL }]);

    // Run the crawler
    await crawler.run();

    // After crawling is done, save any remaining results
    console.log(`Crawling completed. Found ${publications.length} publications.`);

    // Save any remaining publications to MongoDB
    const remainingCount = publicationCounter % 100;
    if (remainingCount > 0) {
        const remaining = publications.slice(publications.length - remainingCount);
        await mongo.bulkUpsert("publications", remaining);
        console.log(`Saved final batch of ${remaining.length} publications to MongoDB`);
    }

    // Create organized data structure
    console.log('Creating organized data structure...');
    const organizedData = {
        byDate: {},
        byStandardNumber: {},
        byOshActSection: {}
    };

    // Organize by date, standard number
    // Using the publications array to avoid loading everything from MongoDB again
    publications.forEach(pub => {
        // Organize by date
        if (!organizedData.byDate[pub.publicationDate]) {
            organizedData.byDate[pub.publicationDate] = [];
        }
        organizedData.byDate[pub.publicationDate].push({
            id: pub._id,
            title: pub.title,
            url: pub.url
        });

        // Organize by standard number
        if (pub.standardNumber !== 'N/A') {
            if (!organizedData.byStandardNumber[pub.standardNumber]) {
                organizedData.byStandardNumber[pub.standardNumber] = [];
            }
            organizedData.byStandardNumber[pub.standardNumber].push({
                id: pub._id,
                title: pub.title,
                url: pub.url,
                publicationDate: pub.publicationDate
            });
        }


    });

    // Save organized data to a separate collection
    try {
        const indexCollection = db.collection('publication_indexes');
        await indexCollection.insertOne(organizedData);
        console.log('Saved organized indexes to MongoDB');
    } catch (error) {
        console.error('Error saving organized data to MongoDB:', error);
    }

    // Also save to local dataset for backup
    await Dataset.pushData(publications);
    await Dataset.pushData(organizedData, { contentType: 'application/json', key: 'organized-data' });

    console.log('Data saved to both MongoDB and local Dataset.');


}

// Run the crawler
runCrawler()
    .catch(err => console.error(err))
    .finally(() => {
        if (mongoClient) mongoClient.close();
    });