// models/Recipient.js
const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    programCode: {
        type: String,
    },

}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt`
});

//before saving in database convert program code to lowercase and without space
// recipientSchema.pre('save', function (next) {
//     this.programCode = this.programCode.toLowerCase().trim();
//     next();
// });

const Recipient = mongoose.model('Recipient', recipientSchema);

module.exports = Recipient;
