const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const decode = req.headers.authorization;
    const [key, token] = decode.toString().split(" ");
    
    const user = jwt.verify(token, process.env.SECRET)
    if (!user) return;
    req.user = user;
    return next(req, res);
}