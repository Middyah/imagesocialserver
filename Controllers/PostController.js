import Post from "../Models/PostModel.js"
export const CreatNewPost = async (req, res) => {
  try {
    const { post_title, category,Contactnumber ,location} = req.body;
    const image = req.files['image'][0];

    const newPost = new Post({
      image: {
        data: image.buffer,
        contentType: image.mimetype,
        image_id: image.originalname,

      },
      post_title,
      category,
      admin_approved: false,
      location,
      Contactnumber
    });

    // Save the document to the database
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const GetPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const category = req.query.category === "0" ? "" : req.query.category;
    const post_title = req.query.post_title || "";
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPosts = await Post.countDocuments();
    const hasMore = endIndex < totalPosts;
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    };
    let images
    if (category === "" && post_title === "") {
      images = await Post.find({},  { post_title: 1, Contactnumber: 1 }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    } else if (category !== "" && post_title === "") {
      images = await Post.find({ category: category }, { post_title: 1, Contactnumber: 1 }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    } else if (category === "" && post_title !== "") {
      images = await Post.find({ post_title: { $regex: post_title, $options: 'i' } },  { post_title: 1, Contactnumber: 1 }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    }
    res.send({
      totalPosts,
      pagination,
      posts: images,
      hasMore
    });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).send('An error occurred');
  }
}





export const PerticulerImg = async (req, res) => {
  try {
    let { id } = req.params
    let postdata = await Post.find({ _id: id })
    let image1 = postdata[0].image
    let imagedata;
    let contentType;

    if (image1 !== undefined) {
      imagedata = image1.data;
      contentType = image1.contentType
    } else {
      imagedata = null;
      contentType = null
    }

    if (imagedata === null) {
      return res.status(404).send({ message: "Image not found", status: false });
    } else {

      res.set('Content-Type', contentType);
      res.send(imagedata);
    }

  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).send('An error occurred');
  }


}

