const mongoose = require('mongoose');

require('../models/User');
require('../models/Volcano'); //TODO import real data model

async function configDatabase(){
    //TODO set database name
    const connectionString = 'mongodb://localhost:27017/magma-haven';

    await mongoose.connect(connectionString);

    console.log('Database connected');
}


module.exports = { configDatabase };