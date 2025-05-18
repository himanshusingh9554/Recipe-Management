import db from '../models/index.js';

const { User, Recipe } = db;

export const getProfile = async (req, res) => {
  try {
  
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
            include: [{ model: Recipe, as: 'recipes' }],
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ username, email, bio });
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
