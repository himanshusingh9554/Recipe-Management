import db from '../models/index.js';
const { User, Recipe } = db;

export const addFavorite = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const recipe = await Recipe.findByPk(req.params.recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });


    await user.addFavorite(recipe);
    res.json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite', error: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const recipe = await Recipe.findByPk(req.params.recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    await user.removeFavorite(recipe);
    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite', error: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Recipe, as: 'favorites' }],
    });
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
};
