// Import required libraries
import { CheerioCrawler, RequestQueue } from 'crawlee';
import MongoDBWrapper from "../api/lib/mongoDBWrapper.js";

const COLLECTION_NAME = 'standard';

// Initialize request queue
const requestQueue = await RequestQueue.open();

// Counter for tracked results
let resultsCount = 0;
// Array to store all standards data
const standardsData = [];

// Starting URL
const startUrl = 'https://www.osha.gov/laws-regs/standardinterpretations/standardnumber';
await requestQueue.addRequest({ url: startUrl, userData: { level: 'root' } });

// Initialize MongoDB client
const mongo = new MongoDBWrapper()

// Create the crawler
const crawler = new CheerioCrawler({
    requestQueue,
    maxRequestRetries: 3,
    requestHandlerTimeoutSecs: 60,

    // Handle each page
    async requestHandler({ request, $, enqueueLinks }) {
        const { level } = request.userData;

        if (level === 'root') {
            console.log('Processing root page...');

            // Extract all standard links from the main page
            const standardLinks = $('div.view-content li a');

            console.log(`Found ${standardLinks.length} standard links`);

            standardLinks.each(async function() {
                const link = $(this).attr('href');
                const fullText = $(this).text().trim();

                // Parse the text to extract standard number and title
                const dashIndex = fullText.indexOf('-');
                if (dashIndex !== -1) {
                    let standardNumber = fullText.substring(0, dashIndex).trim();
                    // Remove 'part' from standard number
                    standardNumber = standardNumber.replace(/part\s+/i, '');

                    const standardTitle = fullText.substring(dashIndex + 1).trim();

                    // Add to standards data
                    standardsData.push({
                        standardNumber,
                        standardTitle,
                        url: new URL(link, request.url).toString(),
                        children: [],
                        level: 'parent'
                    });

                    // Enqueue this link for processing
                    await requestQueue.addRequest({
                        url: new URL(link, request.url).toString(),
                        userData: {
                            level: 'standard',
                            parentIndex: standardsData.length - 1
                        }
                    });
                }
            });

        } else if (level === 'standard') {
            console.log(`Processing standard page: ${request.url}`);
            const { parentIndex } = request.userData;

            // Find child standards on this page
            const childLinks = $('div.view-content li a');

            childLinks.each(function() {
                const link = $(this).attr('href');
                const fullText = $(this).text().trim();

                // Parse text to get child standard number and title
                const dashIndex = fullText.indexOf('-');
                if (dashIndex !== -1) {
                    let standardNumber = fullText.substring(0, dashIndex).trim();
                    // Remove 'part' from standard number
                    standardNumber = standardNumber.replace(/part\s+/i, '');

                    const standardTitle = fullText.substring(dashIndex + 1).trim();
                    if (standardTitle.indexOf("Table of Contents") === 0) {
                        return;
                    }

                    // Add child to parent standard
                    standardsData[parentIndex].children.push({
                        standardNumber,
                        standardTitle,
                        url: new URL(link, request.url).toString()
                    });

                    // Increment results counter
                    resultsCount++;

                }
            });
        }
    },

    // Handle errors
    failedRequestHandler({ request, error }) {
        console.error(`Request ${request.url} failed multiple times`, error);
    },
});

// Execute the crawler and then save any remaining data
try {
    await crawler.run();

    console.log('Crawler finished...');
    console.log(`Total standards collected: ${standardsData.length}`);
    console.log(`Total results (including children): ${resultsCount}`);

    // Save any remaining data if we have some
    if (standardsData.length > 0) {
        console.log('Saving remaining data to MongoDB...');
        await mongo.bulkUpsert(COLLECTION_NAME, standardsData);
    }

    console.log('Crawling process completed successfully!');
} catch (error) {
    console.error('Crawler failed:', error);
}