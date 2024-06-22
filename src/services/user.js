const { User } = require('../models/User');
const bcript = require('bcrypt');

//TODO set identity prop name based on exam description

const identityName = 'email';

async function register(identity, username, password){
    const existing = await User.findOne({[identityName]: identity});

    if(existing){
        throw new Error(`This ${identityName} is already in use`);
    }

    const user = new User({
        [identityName]: identity,
        username,
        password: await bcript.hash(password, 10)
    });
    try {
        await user.save();
    } catch (error) {
        if (error.code == 11000) {
            throw new Error('This username is already in use');
        }
    }
    

    return user;
}

async function login(identity, password){
    const user = await User.findOne({[identityName]: identity});

    if(!user){
        throw new Error(`Incorrect username or password`);
    };

    const match = await bcript.compare(password, user.password);

    if(!match){
        throw new Error(`Incorrect username or password`);
    };

    return user;
}


module.exports = {
    register,
    login
}