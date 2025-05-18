import db from '../models/index.js';
import { Op } from 'sequelize';
const { Recipe, User } = db;

export const searchRecipes = async (filters) => {
  const { keyword, category, minTime, maxTime } = filters;
  const where = {};

  if (keyword) {
    where[Op.or] = [
      { title:       { [Op.like]: `%${keyword}%` } },
      { ingredients: { [Op.like]: `%${keyword}%` } },
      { description: { [Op.like]: `%${keyword}%` } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (minTime && maxTime) {
    where.cookingTime = { [Op.between]: [Number(minTime), Number(maxTime)] };
  } else if (minTime) {
    where.cookingTime = { [Op.gte]: Number(minTime) };
  } else if (maxTime) {
    where.cookingTime = { [Op.lte]: Number(maxTime) };
  }

  return Recipe.findAll({
    where,
    include: [{ model: User, as: 'author', attributes: ['username', 'email'] }],
    order: [['createdAt', 'DESC']],
  });
};
