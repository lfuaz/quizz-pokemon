const { Sequelize } = require("sequelize");

// Initialize the connection to the database using Sequelize
const sequelize = new Sequelize(process.env.MYSQL_URI, {
  host: "192.168.30.9",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to MySQL via Sequelize"))
  .catch((err) => console.error("Unable to connect to MySQL:", err));

module.exports = sequelize;
