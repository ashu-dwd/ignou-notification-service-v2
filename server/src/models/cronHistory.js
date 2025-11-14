const mongoose = require('mongoose');

const cronHistorySchema = new mongoose.Schema({
    runAt: String,
    status: String,
    message: String
});

module.exports = mongoose.model('CronHistory', cronHistorySchema);
