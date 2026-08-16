const { MongoClient } = require('mongodb');
require('dotenv').config();
let database;
async function connectToDatabase() {
    if (database) return database;
    const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await client.connect();
    database = client.db(process.env.MONGO_DB || 'giftsdb');
    return database;
}
module.exports = connectToDatabase;
