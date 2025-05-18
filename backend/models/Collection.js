import { DataTypes } from 'sequelize';

const Collection = (sequelize) => {
  const CollectionModel = sequelize.define('Collection', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  CollectionModel.associate = (models) => {
    CollectionModel.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    CollectionModel.belongsToMany(models.Recipe, {
      through: models.CollectionRecipes || 'CollectionRecipes',
      foreignKey: 'collectionId',
      otherKey: 'recipeId',
      as: 'recipes',
    });
  };

  return CollectionModel;
};

export default Collection;
