


// Initialize MongoDB client
const mongoClient = new MongoClient(MONGO_URI);

// Function to save data to MongoDB with bulk upsert logic
async function saveToMongoDB(data) {
    try {
        await mongoClient.connect();
        const db = mongoClient.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

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