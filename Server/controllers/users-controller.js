const User = require('../models/users-model');
const bcrypt = require('bcryptjs');
const appError = require('../utils/appErrors');

const register = asyncWrapper(
    async(req, res, next) => {

    }
)


const login = asyncWrapper(
    async(req, res, next) => {
        const {email, password} = req.body;
        
    }
)
