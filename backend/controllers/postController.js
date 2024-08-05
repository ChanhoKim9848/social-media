import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

// create post function
const createPost = async (req, res) => {
  try {
    // create post data and save it which has postedBy and text and img data into db
    const { postedBy, text } = req.body;
    let { img } = req.body;

    // if either author and text does not exist, error
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Postedby and text fields are required" });
    }

    // assign postedBy (author) into user
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // if current user is different from author, error
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    // limitation of text
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    // if image exists, upload image on cloudinary cloud
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // save the post data (img, text, postedBy) into db
    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

// get post function
const getPost = async (req, res) => {
  try {
    // get post from db
    const post = await Post.findById(req.params.id);

    // if post does not exist, error
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }
    // return post
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete post function
const deletePost = async (req, res) => {
  try {
    // get post id from db
    const post = await Post.findById(req.params.id);

    // if post does not exist, error
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // if author and the post id are not the same, unauthorized to delete
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    // delete post
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// like and unlike post function
const likeUnlikePost = async (req, res) => {
  try {
    // request user id from db
    const { id: postId } = req.params;

    // get user id which will like the post
    const userId = req.user._id;

    // get post id that will be liked
    const post = await Post.findById(postId);

    // if post does not exist, post not found
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // checks if the user id is in likes
    const userLikedPost = post.likes.includes(userId);

    // if user already exist, unlike post
    if (userLikedPost) {
      //  take user id from likes array and update post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // else like post
      //  push user id into likes array
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// reply to post function
const replyToPost = async (req, res) => {
  try {
    // data to reply on the post and save into db
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    // text does not exist, we cannot reply to post
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    // find post id to reply
    const post = await Post.findById(postId);
    // if post does not exist, error
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // reply
    const reply = { userId, text, userProfilePic, username };

    // push reply replies array of the post
    post.replies.push(reply);
    await post.save();

    res.status(200).json({ message: "Reply added successfully", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get feed post function
const getFeedPost = async (req, res) => {
  try {
    // get user id from db and save into user
    const userId = req.user._id;
    const user = await User.findById(userId);

    // if user does not exist, error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // following accounts
    const following = user.following;

    // get posts from following users and display on the user's feed
    // from latest to oldest
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json({ feedPosts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPost,
};
