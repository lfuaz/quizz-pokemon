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
      bio: {
        type: DataTypes.STRING,
        allowNull: true, // You might want to explicitly define if bio can be null or not
      },
      achievements: {
        type: DataTypes.JSON, // Using JSON for achievements
        defaultValue: [], // Default value is an empty array
        allowNull: false, // Ensure it cannot be null
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Ensure userId cannot be null unless explicitly needed
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
      tableName: "Profiles", // It's a good practice to explicitly define the table name
    }
  );

  return Profile;
};
