module.exports = (sequelize, DataTypes) => {
    const facebookUser = sequelize.define("facebookUser", {
      name: {
        type: DataTypes.STRING,
      },
      facebookId: {
        type: DataTypes.STRING,
      },
      displayName: {
        type: DataTypes.STRING,
      },
      picture: {
        type: DataTypes.STRING,
      },
      emails: {
        type: DataTypes.STRING,
      },
  
    });
    return facebookUser;
  };
  