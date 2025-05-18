import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Follow = sequelize.define('Follow', {
    id: {
       type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true },
  });

  return Follow;
};