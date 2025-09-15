const { model } = require('mongoose');

const Channel = model('channels');

exports.create = async (createChannelDto) => {
    if (createChannelDto.members.length < 2)
        throw new Error('Please select more than two members');
    const channel = new Channel(createChannelDto);
    return await channel.save();
}

exports.read = async (userId) => {
    return await Channel.find({ members: { $in: [userId] } }).populate('members');
}

exports.readOne = async (id) => {
    const channel = await Channel.findById(id);
    if (!channel)
        throw new Error('Not found channel');
    return channel;
}

exports.update = async (data) => {
    const channel = await Channel.findById(data._id);
    if (!channel)
        throw new Error('Not found channel');
    await Channel.findByIdAndUpdate({ _id: data._id }, data);
    return this.readOne(data._id);
}

exports.delete = async (id) => {
    const result = await Channel.findByIdAndDelete(id);
}
