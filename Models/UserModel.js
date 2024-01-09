import mongoose from "mongoose";
const Schema = mongoose.Schema
const userSchema = new Schema({
   
   
    email: {
        type: String
    },
    password: { type: String },
    user_id:{type:String}

}, {
    timestamps: true
})

const User = mongoose.model("AdminInfo", userSchema)
export default User