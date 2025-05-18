import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import Like from './Like.js';
import User from './User.js';
import Recipe from './Recipe.js';
import Review from './review.js';
import Collection from './Collection.js';
import CollectionRecipes from './CollectionRecipes.js';
import FollowModel from './Follow.js';
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    logging: false, 
  }
);

const db = {};





db.User = User(sequelize);
db.Recipe = Recipe(sequelize);
db.Like = Like(sequelize, Sequelize.DataTypes);
db.Review = Review(sequelize);
db.Collection = Collection(sequelize);
db.Follow = FollowModel(sequelize);
db.CollectionRecipes = CollectionRecipes(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});
db.User.belongsToMany(db.User, {
  through: db.Follow,
  as: 'followers',
  foreignKey: 'followingId',
  otherKey: 'followerId'
});
db.User.belongsToMany(db.User, {
  through: db.Follow,
  as: 'following',
  foreignKey: 'followerId',
  otherKey: 'followingId'
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
