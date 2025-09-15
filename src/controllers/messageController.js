const messageService = require('../services/messageService');
const channelService = require('../services/channelService');
const { sendToUsers } = require('../utils/chat');
const { STATUS, REQUEST, METHOD } = require('../constants/chat');
const socketEvents = require('../constants/socketEvents');

exports.create = async (socket, data) => {
    try {
        const message = await messageService.create({ ...data });
        const curData = await channelService.readOne(message.channelId);
        if (curData.ch.isDm == false) {
            let temp = [];
            curData.ch.members.forEach((member) => temp.push(member._id));
            sendToUsers(socket.socketList, temp, socketEvents.CREATEMESSAGE, STATUS.ON, curData.msg);
        } else {
            sendToUsers(socket.socketList, message.receivers, socketEvents.CREATEMESSAGE, STATUS.ON, curData.msg);
        }
        // if (data.parentId) {
        //     sendToUsers(socket.socketList, channel.members, `${REQUEST.MESSAGE}_${METHOD.UPDATE}`, STATUS.ON, await messageService.readOne(data.parent));
        // }
    } catch (err) {
        console.error(err);
        socket.emit(`${REQUEST.MESSAGE}_${METHOD.CREATE}`, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.read = async (socket, data) => {
    try {
        console.log(data)
        const messages = await messageService.read(data);
        socket.emit(socketEvents.READALLMESSAGE, STATUS.ON, { ...data, messages });
    } catch (err) {
        socket.emit(socketEvents.READALLMESSAGE, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.update = async (socket, data) => {
    try {
        const message = await messageService.update(socket.user.id, data.id, data.message);
        const channel = await channelService.readOne(message.channel);
        sendToUsers(socket.socketList, channel.members, `${REQUEST.MESSAGE}_${METHOD.UPDATE}`, STATUS.ON, message);
        socket.emit(`${REQUEST.MESSAGE}_${METHOD.UPDATE}`, STATUS.SUCCESS, data);
    } catch (err) {
        socket.emit(`${REQUEST.MESSAGE}_${METHOD.UPDATE}`, STATUS.FAILED, { ...data, message: err.message });
    }
}

exports.delete = async (socket, data) => {
    try {
        const message = await messageService.delete(socket.user.id, data.id);
        const channel = await channelService.readOne(message.channel);
        sendToUsers(socket.socketList, channel.members, `${REQUEST.MESSAGE}_${METHOD.DELETE}`, STATUS.ON, data);
        socket.emit(`${REQUEST.MESSAGE}_${METHOD.DELETE}`, STATUS.SUCCESS, data);
    } catch (err) {
        socket.emit(`${REQUEST.MESSAGE}_${METHOD.DELETE}`, STATUS.FAILED, { ...data, message: err.message });
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