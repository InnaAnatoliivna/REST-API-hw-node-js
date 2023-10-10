const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schemaUsers = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Set password for user'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        avatarURL: String,
        token: String
    })

const User = model('user', schemaUsers);

module.exports = User