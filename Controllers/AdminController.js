import Post from "../Models/PostModel.js"
import PostLike from "../Models/LikeModel.js"
import User from "../Models/UserModel.js";
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt';
export const RejectPost = async (req, res) => {
    const { post_id } = req.params;
    try {
        let post = await Post.findOne({ _id: post_id })
        if (post) {
            await Post.deleteOne({ _id: post_id })
            res.status(200).send({ message: "Post deleted" })
        } else {
            res.status(400).send({ message: "Post not found" })
        }

    } catch (err) {
        res.status(400).send({ message: "Server error" })
    }
}

export const ApprovedPost = async (req, res) => {
    const { admin_approved } = req.body;
    const { post_id } = req.params;
    try {
        let post = await Post.findOne({ _id: post_id })
        if (post) {
            post.admin_approved = admin_approved
            post.save()
            res.status(200).send({ message: "Approved post" })
        } else {
            res.status(400).send({ message: "Post not found" })
        }

    } catch (err) {
        res.status(400).send({ message: "Server error" })
    }
}

export const Link = async (req, res) => {
    const { post_id } = req.params;
    const { user_id } = req.body;
    try {
        let post = await Post.findOne({ _id: post_id })
        if (post) {

            const newLike = new PostLike({
                post_id,
                user_id
            });

            await newLike.save();
            res.status(200).send({ message: "Post Like" })
        } else {
            res.status(400).send({ message: "Post not found" })
        }

    } catch (err) {
        res.status(400).send({ message: "Server error" })
    }
}


export const LinkCount = async (req, res) => {
    const { post_id } = req.params;
    const {  user_id } = req.query;
    try {
        let post = await PostLike.find({ post_id: post_id })
        let Userlike = await PostLike.find({ user_id: user_id ,post_id:post_id})
        if (post) {

            let total_like = post.length
            let user_like = Userlike.length !== 0 ? true : false
            res.status(200).send({ like: total_like, user_like: user_like })
        } else {
            res.status(400).send({ message: "Post not found" })
        }

    } catch (err) {
        res.status(400).send({ message: "Server error" })
    }
}

export const getShareCount = async (req, res) => {
    const { post_id } = req.params;
    try {
      // Fetch the post from the database
      const post = await Post.findById(post_id);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Return the share count
      res.status(200).json({ shareCount: post.shareCount });
    } catch (error) {
      console.error('Error fetching share count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  export const sharePost = async (req, res) => {
    const { post_id } = req.params;
    try {
        let post = await Post.findById(post_id);
        if (post) {
            post.shareCount += 1;
            await post.save();
            res.status(200).json({ message: 'Post shared successfully', shareCount: post.shareCount });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error sharing post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




export const Creatuser = async (req, res, next) => {
    const { email, password } = req.body;
    const secretKey = "ImageAdmin"
    let user_id = email + "Admin" + new Date().getSeconds()+new Date().getMilliseconds()
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        // Generate a short-lived token 


        const token = jwt.sign({ userId: user_id }, secretKey, { expiresIn: '87600h' });
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
       
            email,
            password: hashedPassword,
            user_id: user_id,

        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user_id: user_id, token: token });

       

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body;
    const secretKey = "ImageAdmin"
    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Invalid User or Password' });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid User or Password' });
        }
        // Generate a short-lived token 

        const token = jwt.sign({ userId: user.user_id }, secretKey, { expiresIn: '87600h' });
        // Password is correct, user is authenticated
        res.status(200).json({ message: 'Login successful', token, user_id: user.user_id });
    } catch (error) {
       
        res.status(500).json({ error: 'Internal server error' });
    }
}
