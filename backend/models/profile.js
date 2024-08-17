"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      Profile.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }

  Profile.init(
    {
      bio: DataTypes.STRING,
      achivements: {
        type: DataTypes.JSON,
        defaultValue: Array(151).fill(false),
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );

  return Profile;
};
