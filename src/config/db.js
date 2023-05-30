const Sequelize = require("sequelize");
const { Model } = require("sequelize");

const sequelize = new Sequelize("sequelize", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connection has been established successfully");
  })
  .catch((error) => {
    console.error("unable to connect to the database", error);
  });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("../routes/model")(sequelize, Sequelize);

sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done");
});

module.exports = db;
