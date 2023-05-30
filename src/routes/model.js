module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
    },
    googleId: {
      type: DataTypes.STRING,
    },
  });
  return user;
};
