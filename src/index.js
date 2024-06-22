const express = require('express');
const { configDatabase } = require('./config/configDatabase');
const { configExpress } = require('./config/configExpress');
const { configHbs } = require('./config/configHbs');
const { configRoutes } = require('./config/configRoutes');

const { register, login } = require('./services/user');
const { createToken, verifyToken } = require('./services/jwt');
const { create } = require('./services/volcano');

start();

async function start() {

    const app = express();

    await configDatabase();
    configExpress(app);
    configHbs(app);
    configRoutes(app);

    app.listen(3000, () => {
        console.log(' Server started http://localhost:3000');
        //test()
    });
}


async function test() {
    try {
        const result = await create({
            name: 'Mount Etna',
            location: 'Sicily Italy',
            elevation: 3357,
            lastEruption: 2013,
            image: 'http://localhost:3000/static/images/etna.jpg',
            typeVolcano: 'Stratovolcanoes',
            description: 'Mount Etna, or simply Etna (Italian: Etna [ˈɛtna] or Mongibello [mondʒiˈbɛllo]; Sicilian: Muncibbeḍḍu [mʊntʃɪbˈbɛɖɖʊ] or a Muntagna; Latin: Aetna; Ancient Greek: Αἴτνα and Αἴτνη[4]), is an active stratovolcano on the east coast of Sicily, Italy, in the Metropolitan City of Catania, between the cities of Messina and Catania. It is located above the convergent plate margin between the African Plate and the Eurasian Plate. It is one of the tallest active volcanoes in Europe,[5] and the tallest peak in Italy south of the Alps with a current height (July 2021) of 3,357 m (11,014 ft),[2] though this varies with summit eruptions. ',
             
        },'667675b053a7cd11916cc2ee');
        console.log(result);

        //const token = createToken(result);

        //console.log(token);
        //const parsedData = verifyToken(token);
        //console.log(parsedData)
    } catch (err) {
        console.log('Caught error ')
        console.log(err.message)
    }
}
