
import db from '../models/index.js';
const { User, Follow } = db;


export const followUser = async (req, res) => {
  try {
    const followerId  = req.user.id;
    const followingId = parseInt(req.params.userId, 10);

    if (Number.isNaN(followingId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (followerId === followingId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findByPk(followingId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    await Follow.findOrCreate({
      where: { followerId, followingId }
    });

    res.json({ message: 'Now following user' });
  } catch (error) {
    console.error('Error in followUser:', error);
    res.status(500).json({ message: 'Error following user', error: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const followerId  = req.user.id;
    const followingId = parseInt(req.params.userId, 10);

    if (Number.isNaN(followingId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    await Follow.destroy({
      where: { followerId, followingId }
    });

    res.json({ message: 'Unfollowed user' });
  } catch (error) {
    console.error('Error in unfollowUser:', error);
    res.status(500).json({ message: 'Error unfollowing user', error: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: User,
        as: 'following',
        attributes: ['id', 'username']
      }]
    });
    res.json({ following: user.following });
  } catch (error) {
    console.error('Error in getFollowing:', error);
    res.status(500).json({ message: 'Error fetching following list', error: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByPk(userId, {
      include: [{
        model: User,
        as: 'followers',
        attributes: ['id', 'username']
      }]
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Error in getFollowers:', error);
    res.status(500).json({ message: 'Error fetching followers list', error: error.message });
  }
};
