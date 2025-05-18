import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CollectionRecipe = sequelize.define('CollectionRecipe', {
  
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }
  });

  return CollectionRecipe;
};