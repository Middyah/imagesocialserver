import Post from "../Models/PostModel.js"
export const CreatNewPost = async (req, res) => {
  try {
    const { post_title, category,Contactnumber ,location,Link,Productname} = req.body;
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
      Contactnumber,
      Link,
      Productname
    });

    // Save the document to the database
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// export const GetPost = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const category = req.query.category === "0" ? "" : req.query.category;
//     const postTitle = req.query.post_title || "";
//     // const location = req.query.location || "";
//     const locations = req.query.location ? req.query.location.split(',') : [];
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const query = {}; 

//     // Adding conditions based on parameters
//     if (category !== "") {
//       query.category = category;
//     }
//     if (postTitle !== "") {
//       query.post_title = { $regex: postTitle, $options: 'i' };
//     }
//     if (locations.length > 0) {
//       query.location = { $in: locations };
//     }
//     // if (location !== "") {
//     //   query.location = location; 
//     // }
//     if (Productname !== "") {
//       query.Productname = { $regex: Productname, $options: 'i' };
//     }
//     const totalPosts = await Post.countDocuments(query);
//     const hasMore = endIndex < totalPosts;

//     const pagination = {
//       currentPage: page,
//       totalPages: Math.ceil(totalPosts / limit),
//     };

//     const images = await Post.find(query, { post_title: 1, Contactnumber: 1, Link:1})
//       .sort({ createdAt: -1 })
//       .skip(startIndex)
//       .limit(limit);

//     res.send({
//       totalPosts,
//       pagination,
//       posts: images,
//       hasMore,
//     });
//   } catch (error) {
//     console.error('Error retrieving images:', error);
//     res.status(500).send('An error occurred');
//   }
// };



export const GetPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // const category = req.query.category === "0" ? "" : req.query.category;
    const category = (req.query.category === "0" || req.query.category === "15") ? "" : req.query.category;
    const postTitle = req.query.post_title || "";
    const locations = req.query.location ? req.query.location.split(',') : [];
    const Productname = req.query.Productname || ""; // Extract Productname from query parameters
    const _id=req.query._id
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const query = {};

    if (category !== "") {
      query.category = category;
    }
    if(_id!==""){
      query._id = _id;
    }
    if (postTitle !== "") {
      query.post_title = { $regex: postTitle, $options: 'i' };
    }
    if (locations.length > 0) {
      query.location = { $in: locations };
    }
    if (Productname !== "") {
      query.Productname = { $regex: Productname, $options: 'i' };
    }

    const totalPosts = await Post.countDocuments(query);
    const hasMore = endIndex < totalPosts;

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    };

    const images = await Post.find(query, { post_title: 1, Contactnumber: 1, Link: 1 })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.send({
      totalPosts,
      pagination,
      posts: images,
      hasMore,
    });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).send('An error occurred');
  }
};




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

