/**
 * Helper function to build a response object for API Gateway
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 * @returns {Object} Formatted API Gateway response
 */
export function buildResponse(statusCode, data) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Enable CORS
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        },
        body: JSON.stringify(data)
    };
}

export const InternalServerError = buildResponse(500, {message: "Internal Server Error"})
export const NotFoundError = buildResponse(404, {message: "Not Found"})
export const BadRequest = buildResponse(400, {message: "Bad Request"})
