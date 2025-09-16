const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        channelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "channels",
            required: true,
        },
        receivers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],
        message: {
            type: String,
            required: true,
        },
        files: [
            {
                type: String,
            },
        ],
        emoticons: [
            {
                recommenders: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "users",
                    },
                ],
                code: {
                    type: String,
                },
            },
        ],
        isPined: [
            {
                type: String,
                default: "",
            },
        ],
        isdraft: {
            type: Boolean,
            default: false,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages",
            default: null,
        },
        childCount: Number,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("messages", messageSchema);
