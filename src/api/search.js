// AWS Lambda API Handler
// This handler processes API Gateway requests and returns responses

import {buildResponse} from "./api.js";

/**
 * Lambda function handler for API Gateway requests
 * @param {Object} event - API Gateway event object
 * @param {Object} context - Lambda execution context
 * @returns {Object} API Gateway response object
 */
export const handler = async (event, context) => {
    // Log the incoming event for debugging purposes
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));

    try {
        // Parse request details
        const queryParams = event.queryStringParameters || {};

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