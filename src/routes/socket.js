const { REQUEST, METHOD, STATUS } = require('../constants/chat');
const authService = require('../services/authService');
const channelCtr = require('../controllers/channelController');
const messageCtr = require('../controllers/messageController');
const userCtr = require('../controllers/userController');
const socketEvents = require('../constants/socketEvents');

const socketList = {};
const userList = [];

const authMdr = async (socket, data, next) => {
    try {
        const token = socket.handshake.headers.token;
        if (!token)
            throw new Error('Unauthorized');
        const user = await authService.loginByToken(token);
        if (user) {
            if(userList.find(v=>v._id==user._id)){

            }else{
                userList.push(user);
            }
            if (!socketList[user._id]) {
                socketList[user._id] = [];
            }
            socketList[user._id].push(socket);
        }else return;
        socket.user = user;
        await next(socket, data);
    } catch (err) {
        socket.emit(REQUEST.AUTH, STATUS.FAILED, err.message);
    }
}

const onConnect = (socket) => {
    console.log(`Socket ${socket.id} is connected`);
    socket.socketList = socketList;
    socket.userList = userList;
    socket.on(`${socketEvents.CHANGESTATUS}`, (data) => authMdr(socket, data, userCtr.changeStatus))
    // socket.on(`${REQUEST.CHANNEL}_${METHOD.CREATE}`, (data) => authMdr(socket, data, channelCtr.create));
    // socket.on(`${REQUEST.CHANNEL}_${METHOD.READ}`, (data) => authMdr(socket, data, channelCtr.read));
    // socket.on(`${REQUEST.CHANNEL}_${METHOD.UPDATE}`, (data) => authMdr(socket, data, channelCtr.update));
    // socket.on(`${REQUEST.CHANNEL}_${METHOD.DELETE}`, (data) => authMdr(socket, data, channelCtr.delete));
    // socket.on(`${REQUEST.MESSAGE}_${METHOD.CREATE}`, (data) => authMdr(socket, data, messageCtr.create));
    // socket.on(`${REQUEST.MESSAGE}_${METHOD.READ}`, (data) => authMdr(socket, data, messageCtr.read));
    // socket.on(`${REQUEST.MESSAGE}_${METHOD.UPDATE}`, (data) => authMdr(socket, data, messageCtr.update));
    // socket.on(`${REQUEST.MESSAGE}_${METHOD.DELETE}`, (data) => authMdr(socket, data, messageCtr.delete));
    // socket.on(REQUEST.EMOTICON, (data) => authMdr(socket, data, messageCtr.emoticon));
    // socket.on(REQUEST.TYPING, (data) => authMdr(socket, data, messageCtr.typing));
}

exports.onConnect = onConnect;
