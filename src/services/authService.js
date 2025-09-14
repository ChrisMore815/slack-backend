const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.loginByToken = async (token) => {
    return await jwt.verify(token, process.env.SECRET);
}