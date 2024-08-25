"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }

  Profile.init(
    {
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      achievements: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow NULL to satisfy the foreign key constraint
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
      tableName: "Profiles",
    }
  );

  return Profile;
};
