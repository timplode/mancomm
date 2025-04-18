// mongodb-wrapper.js
import { MongoClient, ObjectId } from 'mongodb';

/**
 * MongoDB wrapper for database operations
 */
class MongoDBWrapper {
    constructor(uri, dbName) {
        this.uri = uri;
        this.dbName = dbName;
        this.client = null;
        this.db = null;
    }

    /**
     * Connect to MongoDB
     */
    async connect() {
        if (!this.client) {
            try {
                this.client = new MongoClient(this.uri);
                await this.client.connect();
                this.db = this.client.db(this.dbName);
                console.log('Successfully connected to MongoDB');
            } catch (error) {
                console.error('Failed to connect to MongoDB:', error);
                throw error;
            }
        }
        return this.db;
    }

    /**
     * Close the MongoDB connection
     */
    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
            console.log('MongoDB connection closed');
        }
    }

    /**
     * Get a document by its ID
     * @param {string} collectionName - The collection to query
     * @param {string} id - The document ID to find
     * @returns {Promise<Object|null>} - The found document or null
     */
    async getDocumentById(collectionName, id) {
        try {
            await this.connect();
            const collection = this.db.collection(collectionName);

            // Convert string ID to ObjectId if needed
            let objectId;
            try {
                objectId = new ObjectId(id);
            } catch (error) {
                // If conversion fails, use the original id (in case it's not an ObjectId format)
                objectId = id;
            }

            const document = await collection.findOne({ _id: objectId });
            return document;
        } catch (error) {
            console.error(`Error fetching document with ID ${id}:`, error);
            throw error;
        }
    }
}

export default MongoDBWrapper;