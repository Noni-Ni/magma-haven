//TODO replace with real data service according exam description

const { Volcano } = require('../models/Volcano');

async function getAll(){
    return Volcano.find().lean();
}

async function getById(id){
    return Volcano.findById(id).lean();
}

async function create(data, authorId){
    //TODO extract properties from view model

    const record = new Volcano({
        name: data.name,
        location: data.location,
        elevation: data.elevation,
        lastEruption: data.lastEruption,
        image: data.image,
        typeVolcano: data.typeVolcano,
        description: data.description,
        author: authorId
    });

    await record.save();

    return record;
}

async function update(id, data, userId){
    const record = await Volcano.findById(id);

    if(!record){
        throw new ReferenceError('Record not found ' + id);
    }

    if(record.author.toString() != userId){
        throw new Error('Access denied');
    }

    

        record.name= data.name,
        record.location= data.location,
        record.elevation= data.elevation,
        record.lastEruption= data.lastEruption,
        record.image= data.image,
        record.typeVolcano= data.typeVolcano,
        record.description= data.description

    await record.save();

    return record;
}

async function getByAuthorId(authorId){
    return Volcano.find({ author: authorId}).lean();
}



async function addVote(volcanoId, userId){
    const record = await Volcano.findById(volcanoId);
    if(!record){
        throw new ReferenceError('Record not found ' + volcanoId);
    }

    if(record.author.toString() == userId){
        throw new Error('Cannot vote for your own publication');
    }

    if(record.voteList.find(v => v.toString() == userId)){
        throw new Error('Cannot vote twice')
    }

    record.voteList.push(userId);
    await record.save();
    return record;
}

async function deleteById(id, userId){
    const record = await Volcano.findById(id);
    

    if(!record){
        throw new ReferenceError('Record not found ' + id);
    }

    if(record.author.toString() != userId){
        throw new Error('Access denied');
    }

    await Volcano.findByIdAndDelete(id);
}

async function searchFor(name, typeVolcano){
    let query = {};

    if(name){
        query.name = new RegExp(name, 'i');
    }
    if(typeVolcano && typeVolcano != '---'){
        query.typeVolcano = typeVolcano;
    }

    return Volcano.find(query).lean();
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    addVote,
    getByAuthorId,
    searchFor
}