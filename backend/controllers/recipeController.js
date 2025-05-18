import db from '../models/index.js';
import { searchRecipes } from '../services/recipeService.js';
const { Recipe, Like } = db;

export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookingTime, servings, category } = req.body;
    const image = req.file?.filename || null;

    if (await Recipe.findOne({ where: { title } })) {
      return res.status(400).json({ message: 'A recipe with this title already exists' });
    }

    const recipe = await Recipe.create({
      title, description, ingredients, instructions,
      cookingTime, servings, image, category,
      userId: req.user.id,
    });

    res.status(201).json({ message: 'Recipe created successfully', recipe });
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const filters = {
      keyword:  req.query.search,
      category: req.query.category,
      minTime:  req.query.minTime,
      maxTime:  req.query.maxTime,
    };
    const recipes = await searchRecipes(filters);
    res.status(200).json({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [{ model: db.User, as: 'author', attributes: ['id','username', 'email'] }],
    });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ recipe });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

export const likeRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const existing = await Like.findOne({ where: { userId, recipeId: recipe.id } });
    if (existing) {
      await existing.destroy();
      recipe.likes -= 1;
      await recipe.save();
      return res.json({ message: 'Like removed', likes: recipe.likes });
    }

    await Like.create({ userId, recipeId: recipe.id });
    recipe.likes += 1;
    await recipe.save();
    res.status(201).json({ message: 'Recipe liked', likes: recipe.likes });
  } catch (error) {
    console.error('Error liking recipe:', error);
    res.status(500).json({ message: 'Error liking recipe', error: error.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const { title, description, ingredients, instructions, cookingTime, servings, category } = req.body;
    const image = req.file?.filename || recipe.image;
    await recipe.update({ title, description, ingredients, instructions, cookingTime, servings, category, image });
    res.json({ message: 'Recipe updated successfully', recipe });
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }
    await recipe.destroy();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};
