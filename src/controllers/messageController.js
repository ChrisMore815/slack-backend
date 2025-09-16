const messageService = require('../services/messageService');
const channelService = require('../services/channelService');
const { sendToUsers } = require('../utils/chat');
const { STATUS, REQUEST, METHOD } = require('../constants/chat');
const socketEvents = require('../constants/socketEvents');

exports.create = async (socket, data) => {
    try {
        const message = await messageService.create({ ...data });
        const channel = await channelService.readOne(message.channelId);
        sendToUsers(socket.socketList, channel.members, socketEvents.CREATEMESSAGE, STATUS.ON, message)
    } catch (err) {
        console.error(err);
        socket.emit(`${REQUEST.MESSAGE}_${METHOD.CREATE}`, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.readAll = async (socket, data) => {
    try {
        const messages = await messageService.readAll(data);
        socket.emit(socketEvents.READALLMESSAGE, STATUS.ON, messages);
    } catch (err) {
        socket.emit(socketEvents.READALLMESSAGE, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.update = async (socket, data) => {
    try {
        const message = await messageService.update(data.id, data.message);
        const curData = await channelService.readOne(message.channelId);
        let temp = [];
        curData.ch.members.forEach((member) => temp.push(member._id));
        sendToUsers(socket.socketList, temp, socketEvents.UPDATEMESSAGE, STATUS.ON, curData.msg);
    } catch (err) {
        socket.emit(socketEvents.UPDATEMESSAGE, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.delete = async (socket, data) => {
    try {
        const message = await messageService.delete(data);
        const curData = await channelService.readOne(message.channelId);
        sendToUsers(socket.socketList, temp, socketEvents.DELETEMESSAGE, STATUS.ON, curData.msg);
    } catch (err) {
        socket.emit(socketEvents.DELETEMESSAGE, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.emoticon = async (socket, data) => {
    try {
        const message = await messageService.emoticon(data.messageId, { creator: socket.user.id, code: data.emoticonId });
        const channel = await channelService.readOne(message.channel);
        sendToUsers(socket.socketList, channel.members, `${REQUEST.MESSAGE}_${METHOD.UPDATE}`, STATUS.ON, message);
        socket.emit(REQUEST.EMOTICON, STATUS.SUCCESS, data);
    } catch (err) {
        socket.emit(REQUEST.EMOTICON, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.typing = async (socket, data) => {
    try {
        const channel = await channelService.readOne(data.channelId);
        sendToUsers(socket.socketList, channel.members, REQUEST.TYPING, STATUS.ON, { ...data, user: socket.user.id });
        socket.emit(REQUEST.TYPING, STATUS.SUCCESS, data);
    } catch (err) {
        socket.emit(REQUEST.TYPING, STATUS.FAILED, { ...data, message: err.message });
    }
}