import Post from '../models/Post.js';
import User from '../models/User.js';
import imagekit from '../config/imagekit.js';

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim() && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Text or image is required',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let imageUrl = '';

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: '/social-posts',
      });

      imageUrl = uploadResponse.url;
    }

    const post = await Post.create({
      userId: user._id,
      username: user.username,
      text: text?.trim() || '',
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Post created',
      post: {
        id: post._id,
        userId: post.userId,
        username: post.username,
        text: post.text,
        image: post.image,
        likesCount: 0,
        commentsCount: 0,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, please try again',
    });
  }
};

export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    const feed = posts.map((post) => ({
      id: post._id,
      userId: post.userId,
      username: post.username,
      text: post.text,
      image: post.image,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      createdAt: post.createdAt,
    }));

    res.status(200).json({
      success: true,
      posts: feed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, please try again',
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const likeIndex = post.likes.findIndex(
      (like) => like.userId.toString() === req.user.id
    );

    // already liked → remove (unlike)
    if (likeIndex !== -1) {
      post.likes.splice(likeIndex, 1);
      await post.save();

      return res.status(200).json({
        success: true,
        liked: false,
        likesCount: post.likes.length,
      });
    }

    // not liked yet → add like
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    post.likes.push({
      userId: user._id,
      username: user.username,
    });

    await post.save();

    res.status(200).json({
      success: true,
      liked: true,
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, please try again',
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    post.comments.push({
      userId: user._id,
      username: user.username,
      text: text.trim(),
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment added',
      post: {
        id: post._id,
        userId: post.userId,
        username: post.username,
        text: post.text,
        image: post.image,
        likes: post.likes,
        comments: post.comments,
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error, please try again',
    });
  }
};
