import mongoose from "mongoose";

// user post data,
const postSchema = mongoose.Schema(
  {
    postedBy: {
      // user ID from mongoDB
      type: mongoose.Schema.Types.ObjectId,
      // reference from user ID
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },

    //   replies have other users' profile id, text, profiles and names
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    // keep up to date
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
