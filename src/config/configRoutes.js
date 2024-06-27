// TODO import routers

const { catalogRouter } = require("../controllers/catalog");
const { homeRouter } = require("../controllers/home");
const { userRouter } = require("../controllers/user");
const { volcanoRouter } = require("../controllers/volcano");

function configRoutes(app){
     app.use(homeRouter);
     app.use(catalogRouter);
     app.use(userRouter);
     app.use(volcanoRouter);
     

     app.get('*', (req, res) => {
          res.render('404');
     })
}

module.exports = { configRoutes };
