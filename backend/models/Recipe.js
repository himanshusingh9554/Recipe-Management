import { DataTypes } from 'sequelize';

const Recipe = (sequelize) => {
  const RecipeModel = sequelize.define('Recipe', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cookingTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },  category: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  });

  RecipeModel.associate = (models) => {
    RecipeModel.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
    RecipeModel.hasMany(models.Review, { foreignKey: 'recipeId', as: 'reviews' });
    RecipeModel.belongsToMany(models.User, {
      through: 'FavoriteRecipes',
      as: 'favoritedBy',
      foreignKey: 'recipeId',
    });
  };

  return RecipeModel;
};

export default Recipe;
