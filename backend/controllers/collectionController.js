
import db from '../models/index.js';
const { Collection, Recipe } = db;

export const createCollection = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCol = await Collection.create({
      title, description, userId: req.user.id
    });
    res.status(201).json(newCol);
  } catch (err) {
    res.status(500).json({ message: 'Error creating collection', error: err.message });
  }
};

export const getCollections = async (req, res) => {
  try {
    const cols = await Collection.findAll({
      where: { userId: req.user.id },
      include: [{ model: Recipe, as: 'recipes' }],
    });
    res.json(cols);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching collections', error: err.message });
  }
};

export const getCollectionById = async (req, res) => {
  try {
    const col = await Collection.findByPk(req.params.id, {
      include: [{ model: Recipe, as: 'recipes' }],
    });
    if (!col || col.userId !== req.user.id) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.json(col);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching collection', error: err.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const col = await Collection.findByPk(req.params.id);
    if (!col || col.userId !== req.user.id) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    const { title, description } = req.body;
    await col.update({ title, description });
    res.json(col);
  } catch (err) {
    res.status(500).json({ message: 'Error updating collection', error: err.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const col = await Collection.findByPk(req.params.id);
    if (!col || col.userId !== req.user.id) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    await col.destroy();
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting collection', error: err.message });
  }
};

export const addRecipeToCollection = async (req, res) => {
  const { id: collectionId, recipeId } = req.params;
  const col = await Collection.findByPk(collectionId);
  if (!col || col.userId !== req.user.id)
    return res.status(404).json({ message: 'Collection not found' });

  const recipe = await Recipe.findByPk(recipeId);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  await col.addRecipe(recipe);
  res.json({ message: 'Recipe added to collection' });
};

export const removeRecipeFromCollection = async (req, res) => {
  try {
    const { id, recipeId } = req.params;
    const col = await Collection.findByPk(id);
    if (!col || col.userId !== req.user.id) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    await col.removeRecipe(recipe);
    res.json({ message: 'Recipe removed from collection' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing recipe', error: err.message });
  }
};
