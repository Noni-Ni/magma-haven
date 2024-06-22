// TODO import routers

const { catalogRouter } = require("../controllers/catalog");
const { homeRouter } = require("../controllers/home");
const { userRouter } = require("../controllers/user");

function configRoutes(app){
     app.use(homeRouter);
     app.use(catalogRouter);
     app.use(userRouter)
     //TODO register routers
}

module.exports = { configRoutes };
