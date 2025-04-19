// mongodb-wrapper.js
import { MongoClient, ObjectId } from 'mongodb';

/**
 * MongoDB wrapper for database operations
 */
class MongoDBWrapper {
    constructor() {

        const MONGO_HOST = process.env['MONGO_HOST']
        const MONGO_USER = process.env['MONGO_USER']
        const MONGO_PASS = encodeURIComponent(process.env['MONGO_PASS'])
        const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:27017`

        this.uri = MONGO_URI;
        this.dbName = process.env['MONGO_DB'];
        console.log(MONGO_URI,this.dbName )
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

     async getDistictValues(collectionName, fieldName){
        try {
            await this.connect();
            const collection = this.db.collection(collectionName);
            const values = await collection.distinct(fieldName)
            return values;
        } catch (error) {
            console.error(`Error fetching distinct values with ID collectionName, fieldName:`, collectionName, fieldName, error);
            throw error;
        }
    }

    async query(collectionName, query) {
        try {
            await this.connect();
            const collection = this.db.collection(collectionName);
            const values = await collection.find(query).toArray();

            return values;
        } catch (error) {
            console.error(`Error on query`, query, error);
            throw error;
        }
    }

    // Function to save data to MongoDB with bulk upsert logic
    async bulkUpsert(collectionName, data) {
        try {
            await this.connect();
            const collection = this.db.collection(collectionName);

            // Create a bulk operation
            const bulkOps = data.map(standard => ({
                updateOne: {
                    filter: { standardNumber: standard.standardNumber },
                    update: { $set: standard },
                    upsert: true
                }
            }));

            // Execute the bulk operation
            if (bulkOps.length > 0) {
                const result = await collection.bulkWrite(bulkOps);
                console.log(`MongoDB bulk operation complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`);
            } else {
                console.log('No data to save to MongoDB');
            }
        } catch (err) {
            console.error('Error saving to MongoDB:', err);
        }
    }
}

export default MongoDBWrapper;