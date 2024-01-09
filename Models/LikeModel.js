import mongoose from "mongoose";
const Schema=mongoose.Schema
const UsersLike = Schema({
    post_id:String,
    user_id:String
  });

  const PostLike = mongoose.model('UsersLike', UsersLike);
  export default PostLike