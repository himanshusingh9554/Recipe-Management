import { DataTypes } from 'sequelize';

const Like = (sequelize) => {
  const LikeModel = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Recipes', key: 'id' },
      onDelete: 'CASCADE',
    },
  });

  LikeModel.associate = (models) => {
    LikeModel.belongsTo(models.User, { foreignKey: 'userId' });
    LikeModel.belongsTo(models.Recipe, { foreignKey: 'recipeId' });
  };

  return LikeModel;
};

export default Like;
