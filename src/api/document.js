// AWS Lambda API Handler
// This handler processes API Gateway requests and returns responses

import {BadRequest, buildResponse, InternalServerError, NotFoundError} from "./api.js";
import MongoDBWrapper from "../lib/mongoDBWrapper.js";

/**
 * Lambda function handler for API Gateway requests
 * @param {Object} event - API Gateway event object
 * @param {Object} context - Lambda execution context
 * @returns {Object} API Gateway response object
 */
 export const handler = async (event, context) => {

    try {
        if (!event.hasOwnProperty('pathParameters') || !event.pathParameters.hasOwnProperty("id")) {
            return BadRequest
        }
        const id = event.pathParameters['id']
        const mongo = new MongoDBWrapper()
        const doc = await mongo.getDocumentById("publications",id)
        if (doc === null) {
            return NotFoundError
        }

        //explicity define return fields just in case non-public data lives here
        const returnDoc = {
            title: doc.title,
            publicationDate: doc.publicationDate,
            standards: doc.standardNumber,
            content: doc.content,
            url: doc.url
        }
        // Return successful response
        return buildResponse(200, returnDoc);
    } catch (error) {
        console.error('Error:', error);

        // Return error response
        return InternalServerError
    }
};