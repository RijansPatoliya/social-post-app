import Post from '../models/Post.js';
import User from '../models/User.js';
import imagekit from '../config/imagekit.js';

// Create post
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim() && !req.file) {
      return res.status(400).json({
        message: 'Text or image is required'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    let imageUrl = '';
    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: '/social-posts',
      });
      imageUrl = uploaded.url;
    }

    const post = await Post.create({
      userId: user._id,
      username: user.username,
      text: text?.trim() || '',
      image: imageUrl,
    });

    res.status(201).json({
      message: 'Post created',
      post: post
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating post'
    });
  }
};

// Get all posts
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Posts fetched',
      posts: posts
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching posts'
    });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const posts = await Post.find({ userId: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'User posts fetched',
      posts: posts
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user posts'
    });
  }
};

// Like or unlike post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    const userId = req.user.id;
    const isLiked = post.likes.some(like => like.userId.toString() === userId);

    if (isLiked) {
      post.likes = post.likes.filter(like => like.userId.toString() !== userId);
      await post.save();
      
      return res.status(200).json({
        liked: false,
        post: post
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    post.likes.push({
      userId: user._id,
      username: user.username
    });
    await post.save();

    res.status(200).json({
      liked: true,
      post: post
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error liking post'
    });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text?.trim()) {
      return res.status(400).json({
        message: 'Comment is required'
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    post.comments.push({
      userId: user._id,
      username: user.username,
      text: text.trim()
    });
    await post.save();

    res.status(200).json({
      post: post
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding comment'
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Cannot delete other posts'
      });
    }

    await Post.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      message: 'Post deleted'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting post'
    });
  }
};