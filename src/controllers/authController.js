const User = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateTokens = require('../utils/generateTokens');

//signUp
exports.signUp = (req, res) => {

    const { email, password, username, status } = req.body;
    // return console.log(req.body)

    if (!email || !password || !username || !status) {
        return res.status(200).json({ mes: "Please fill all the fields", status: "warning" });
    }
    User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(200).json({ mes: "Email already exists", status: "info" });
        }
        bcrypt.hash(password, 10, (err, hash) => {
            const user = new User({
                email,
                status,
                username,
                password: hash,
            });
            user
                .save()
                .then(() =>
                    res.status(200).json({
                        mes: "Registered", status: "success"
                    })
                )
                .catch((err) => res.status(500).json({ mes: err.message, status: "error" }));
        });
    });
};

//signIn
exports.signIn = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }).then((user) => {

        if (!user) {
            return res.status(400).json({ error: "user is not found", status: "error" });
        }
        bcrypt.compare(password, user.password, (err, result) => {

            if (!result) {
                return res.status(401).json({ error: "password incorrect", status: "warning" });
            }
            const Token = generateTokens(user);

            return res.json({
                token: Token,
                message: "Signed",
                status: "success"
            });
        });
    });
};

exports.checkAuth = (req, res) => {
    const user = req.user;

    return res.status(200).json({
        user: user,
        mes: "Checked",
        status: "success"
    })
}
