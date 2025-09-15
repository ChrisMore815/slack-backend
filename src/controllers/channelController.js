const channelService = require('../services/channelService');
const { sendToUsers } = require('../utils/chat');
const { STATUS, REQUEST, METHOD } = require('../constants/chat');
const socketEvents = require('../constants/socketEvents');

exports.create = async (socket, data) => {
    try {
        const channel = await channelService.create({ ...data });
        sendToUsers(socket.socketList, channel.members, socketEvents.CREATECHANNEL, STATUS.ON, channel);
    } catch (err) {
        console.error(err);
        socket.emit(socketEvents.CREATECHANNEL, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.readOne = async (socket, data) => {
    try {
        const channel = await channelService.readOne(data);
        socket.emit(socketEvents.READCHANNEL, STATUS.ON, channel)
    } catch (error) {
        socket.emit(socketEvents.READCHANNEL, STATUS.FAILED, { ...data, messsage: err.message })
    }
}

exports.read = async (socket, data) => {
    try {
        const channels = await channelService.read(socket.user._id);
        socket.emit(socketEvents.READALLCHANNEL, STATUS.ON, channels);
    } catch (err) {
        socket.emit(socketEvents.READALLCHANNEL, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.update = async (socket, data) => {
    try {
        const channel = await channelService.update(data);
        sendToUsers(socket.socketList, channel.members, socketEvents.UPDATECHANNEL, STATUS.ON, channel);
    } catch (err) {
        socket.emit(socketEvents.UPDATECHANNEL, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.delete = async (socket, data) => {
    try {
        // console.log(data)
        const channel = await channelService.readOne(data)
        await channelService.delete(data);
        sendToUsers(socket.socketList, channel.members, socketEvents.DELETECHANNEL, STATUS.ON);
    } catch (err) {
        socket.emit(socketEvents.DELETECHANNEL, STATUS.FAILED, { ...data, message: err.message });
    }
}
