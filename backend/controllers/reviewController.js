import db from '../models/index.js';

const { Review, Recipe, User } = db;

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipeId = req.params.recipeId;

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    const existing = await Review.findOne({
      where: { User, recipeId }
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this recipe' });
    }
    const review = await Review.create({
      rating,
      comment,
      recipeId,
      userId: req.user.id,
    });
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

export const getReviewsForRecipe = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const reviews = await Review.findAll({
      where: { recipeId },
      include: [{ model: User, as: 'user', attributes: ['username'] }],
    });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
  
    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }
    const { rating, comment } = req.body;
    await review.update({ rating, comment });
    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
 
    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};
