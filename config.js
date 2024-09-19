// config.js
require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

const dbURI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

module.exports = {
    dbURI,
    secret: process.env.SECRET
};