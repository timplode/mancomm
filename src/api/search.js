// AWS Lambda API Handler
// This handler processes API Gateway requests and returns responses

import {buildResponse} from "./api.js";
import MongoDBWrapper from "./lib/mongoDBWrapper.js";

/**
 * Lambda function handler for API Gateway requests
 * @param {Object} event - API Gateway event object
 * @param {Object} context - Lambda execution context
 * @returns {Object} API Gateway response object
 */
export const handler = async (event, context) => {
    // Log the incoming event for debugging purposes

    try {
        // Parse request details
        const {fromYear, toYear, standardNumber} = event.queryStringParameters || {};
        const query = {}
        if (fromYear !== undefined && toYear !== undefined) {
            query.publicationDate = {
                '$gte': fromYear + "-01-01",
                '$lte': toYear + "-12-31"
            }
        }
        if (standardNumber !== undefined) {
            query.standardNumber = {'$regex': new RegExp(`^${standardNumber}`)}
        }

        const mongo = new MongoDBWrapper()
        const matches = await mongo.query("publications", query)

        const response = matches.map(doc => ({
            title: doc.title,
            publicationDate: doc.publicationDate,
            standardNumber: doc.standardNumber,
            content: doc.content,
            url: doc.url,
            id: doc._id
        }))

        // Return successful response
        return buildResponse(200, response);

    } catch (error) {
        console.error('Error:', error);

        // Return error response
        return buildResponse(
            error.statusCode || 500,
            { message: error.message || 'Internal Server Error' }
        );
    }
};