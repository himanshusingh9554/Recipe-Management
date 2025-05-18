import { DataTypes } from 'sequelize';

const User = (sequelize) => {
  const UserModel = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
 

  UserModel.associate = (models) => {
  
    UserModel.hasMany(models.Recipe, { foreignKey: 'userId', as: 'recipes' });
    UserModel.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });

    UserModel.belongsToMany(models.Recipe, {
      through: 'FavoriteRecipes',
      as: 'favorites',
      foreignKey: 'userId',
    });
    UserModel.hasMany(models.Collection, { foreignKey: 'userId', as: 'collections' });
  };

  return UserModel;
};

export default User;
