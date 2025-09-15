const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        avatar: {
            type: String,
            default: 'default.gif'
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("users", userSchema);
