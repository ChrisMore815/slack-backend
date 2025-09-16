const { model } = require('mongoose');

const Message = model('messages');

exports.create = async (createMessageDto) => {
    const message = new Message(createMessageDto);
    return await message.save();
}

exports.readAll = async (data) => {
    const messages = await Message.find({ channelId: { $in: [data] } });
    return messages;
}

exports.readOne = async (id) => {
    const message = await Message.findById(id);
    return message;
}

exports.update = async (id, updateMessageDto) => {
    await Message.updateOne({ _id: id }, { ...updateMessageDto });
    return await this.readOne(id);
}

exports.delete = async (id) => {
    const message = await Message.findById(id);
    await Message.deleteOne({ _id: id });
    return message;
}

exports.emoticon = async (id, createEmoticonDto) => {
    const message = await Message.findById(id);
    const emoticons = message.emoticons;
    let updatedEmoticons;
    if (emoticons.some(emoticon => emoticon.creator == createEmoticonDto.creator && emoticon.code == createEmoticonDto.code)) {
        updatedEmoticons = emoticons.filter((emoticon) => !(emoticon.creator == createEmoticonDto.creator && emoticon.code == createEmoticonDto.code));
    } else {
        updatedEmoticons = [...emoticons, createEmoticonDto];
    }
    await Message.findByIdAndUpdate(id, {
        emoticons: updatedEmoticons,
    });
    return this.readOne(id);
}

exports.readParent = async (id) => {
    return await Message.find({ parentId: { $in: [id] } });
}