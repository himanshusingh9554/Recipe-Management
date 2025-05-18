import { DataTypes } from 'sequelize';

const Review = (sequelize) => {
  const ReviewModel = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  ReviewModel.associate = (models) => {
    ReviewModel.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    ReviewModel.belongsTo(models.Recipe, { foreignKey: 'recipeId', as: 'recipe' });
  };

  return ReviewModel;
};

export default Review;
