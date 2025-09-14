const { model } = require('mongoose');

const User = model('users');

exports.create = (createUserDto) => {
    const user = new User(createUserDto);
    return user.save();
}

exports.read = () => {
    return User.find();
}

exports.readOne = async (id) => {
    const user = await User.findById(id);
    if (!user)
        throw new Error('Not found user');
    return user;
}

exports.update = async (id, updateUserDto) => {
    await User.updateOne({ _id: id }, updateUserDto);
    return User.findById(id);
}

exports.delete = (id) => {
    return User.findByIdAndDelete(id);
}
