"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//relationships

//college relationship
db.College.hasMany(db.Course, {
  as: "courses",
  foreignKey: "collegeId",
  allowNull: false,
});

db.Course.belongsTo(db.College, {
  as: "college",
  foreignKey: "collegeId",
  allowNull: false,
});

/**
 * many-to-many relationship
 *
 * We need 2 `belongsToMany` that goes both ways
 *
 * e.g. db.Foo.belongsToMany(db.Bar, options)
 *      db.Bar.belongsToMany(db.Foo, options)
 *
 * for the options:
 * {
 *    through: name of the through table in the db
 *    as: the name of the array on the fetched object
 *    foreignKey: the ambassador that you send to the through table (perspective of first model)
 * }
 */

// student course relationship
db.Student.belongsToMany(db.Course, {
  through: "StudentCourse",
  as: "courses",
  foreignKey: "studentId",
});

db.Course.belongsToMany(db.Student, {
  through: "StudentCourse",
  as: "students",
  foreignKey: "courseId",
});

module.exports = db;
