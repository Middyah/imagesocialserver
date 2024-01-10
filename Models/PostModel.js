import mongoose from "mongoose";
const Schema = mongoose.Schema
const UploadPost = Schema({
  image: {
    data: Buffer,
    contentType: String,
  },


  createdAt: {
    type: Date,
    default: Date.now
  },
  admin_approved: Boolean,
  post_title: String,
  category: String,
  tag: String,
  location: String,
  Contactnumber: String,
  Link: String,
  Productname: String,

});

const Post = mongoose.model('UploadPosts', UploadPost);
export default Post