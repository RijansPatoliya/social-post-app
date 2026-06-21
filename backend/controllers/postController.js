import Post from '../models/Post.js';

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
