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

        const mongo = new MongoDBWrapper()
        let standardList = await mongo.getDistictValues("publications", "standardNumber")

        standardList = standardList.reduce((acc,e) => {
            //mongo counts undefined as a value apparently
            if (e === undefined) {
                return acc
            }
            acc.push({label: e, id: e})
            return acc
        }, [])


        // Return successful response
        return buildResponse(200, standardList);
    } catch (error) {
        console.error('Error:', error);

        // Return error response
        return InternalServerError
    }
};