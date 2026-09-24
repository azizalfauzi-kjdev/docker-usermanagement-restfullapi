const app = require('../src/index');
const serverless = require('serverless-http');

// Menghubungkan Express app dengan serverless handler Vercel
module.exports = serverless(app);