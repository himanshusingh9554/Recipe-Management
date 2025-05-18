import db from '../models/index.js';

const { User, Recipe } = db;

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
export const getUserRecipesAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const recipes = await Recipe.findAll({
      where: { userId },
      include: [{ association: 'author', attributes: ['username','email'] }],
      order: [['createdAt','DESC']]
    });
    return res.json({ recipes });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user recipes', error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};


export const getAllRecipesAdmin = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [{ association: 'author', attributes: ['username', 'email'] }],
    });
    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};


export const deleteRecipeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    await recipe.destroy();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};
export const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id == id) {
      return res.status(400).json({ message: 'Cannot ban yourself' });
    }
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = true;
    await user.save();
    res.json({ message: 'User has been banned' });
  } catch (error) {
    res.status(500).json({ message: 'Error banning user', error: error.message });
  }
};


export const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = false;
    await user.save();
    res.json({ message: 'User has been unbanned' });
  } catch (error) {
    res.status(500).json({ message: 'Error unbanning user', error: error.message });
  }
};