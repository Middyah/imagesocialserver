import express from "express";
import {CreatNewPost,GetPost,PerticulerImg } from "../Controllers/PostController.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router=express.Router()

router.post('/newupload', upload.fields([{ name: 'image' }]),CreatNewPost)
router.get('/getallpost',GetPost)
router.get('/images/:id',PerticulerImg)
export default router