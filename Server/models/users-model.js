const mongoose = require('mongoose');
const Validator = require('validator');

const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [Validator.isEmail, 'Filed Must Ba An Email Address'],
    },
    password: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        required: true,
    },
    avatar: {
        type: String,
        default: 'uploads/profile.jpeg',
        required: true
    },
    token: {
        type: String,
    }, 
    role: {
        type: String,
        enum: [userRoles.ADMIN, userRoles.MANAGER, userRoles.USER],
        default: userRoles.USER
    },
})

module.exports = mongoose.model('User', usersSchema);