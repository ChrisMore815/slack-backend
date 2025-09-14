const { STATUS } = require('../constants/chat');
const socketEvents = require('../constants/socketEvents');
const userService = require('../services/userService');
const { sendToUsers } = require('../utils/chat');

exports.create = async (req, res) => {
    try {
        const result = await userService.create(req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

exports.read = async (req, res) => {
    try {
        const result = await userService.read();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

exports.readOne = async (req, res) => {
    try {
        const result = await userService.readOne(req.params.id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    try {
        const result = await userService.update(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const result = await userService.delete(req.params.id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

exports.changeStatus = async (socket, data) => {
    try {
        let members = [];
        const result = await userService.update(data.id, { status: data.status });
        socket.userList.forEach((user) => {
            members.push(user._id);
        })
        sendToUsers(socket.socketList, members, socketEvents.CHANGESTATUS, STATUS.ON, result)
    } catch (error) {

    }
}
