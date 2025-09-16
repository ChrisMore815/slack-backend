const { model } = require('mongoose');

const Channel = model('channels');
const Message = model('messages');

exports.create = async (createChannelDto) => {
    const channel = new Channel(createChannelDto);
    return await channel.save();
}

exports.read = async (userId) => {
    return await Channel.find({ members: { $in: [userId] } }).populate('members');
}

exports.readOne = async (id) => {
    const channel = await Channel.findById(id);
    return channel;
}

exports.update = async (data) => {
    await Channel.updateOne({ _id: data._id }, data);
    return this.readOne(data._id);
}

exports.delete = async (id) => {
    const channel = await Channel.findById(id);
    await Channel.findByIdAndDelete(id);
    return channel;
}
