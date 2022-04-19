const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { body, validationResult } = require('express-validator');
const { htmlToText } = require('html-to-text');
const blockTextBuilder = require('html-to-text/lib/block-text-builder');

module.exports.createPost = (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        // console.log(fields);
        // console.log(files);
        // return res.json({ files });
        const { title, body, description, slug, id, name } = fields;
        const errors = [];

        // we don't use express validator because validator these package pass to req.body buth here data ins present in fields.
        if (title === '') {
            errors.push({ msg: "Title is required" })
        }
        if (body === '') {
            errors.push({ msg: "Body is required" })
        }
        if (description === '') {
            errors.push({ msg: "Description is required" })
        }
        if (slug === '') {
            errors.push({ msg: "Slug is required" })
        }
        if (Object.keys(files).length === 0) {
            errors.push({ msg: "Image is required" })
        } else {
            //check image is jpg or png format
            const { mimetype } = files.image;
            const split = mimetype.split('/');
            const extension = split[1].toLowerCase();
            if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
                error.push({ msg: `${extension} is not valid extension.please use png or jpg format image` })
            } else {
                // files.image.name=uuidv4()+'.'+extension;
                // files.image.newFilename=uuidv4()+'.'+extension;
                files.image.originalFilename = uuidv4() + '.' + extension;
            }
        }
        //check same name url present in db?
        const checkSlug = await Post.findOne({ slug });
        if (checkSlug) {
            errors.push({ msg: 'Please choose a unique slug/URL' });
        }
        if (errors.length !== 0) {
            return res.status(400).json({ errors, files }); //files means image data
        }
        else {
            // const newPath=__dirname+`/../client/public/image/${files.image.name}` //access absolute path
            // const newPath=__dirname+`/../client/public/image/${files.image.newFilename}` //access absolute path
            const newPath = __dirname + `/../client/build/image/${files.image.originalFilename}` //access absolute path
            fs.copyFile(files.image.filepath, newPath, async (error) => {
                if (!error) {
                    // console.log("image Uploaded");
                    try {
                        const response = await Post.create({
                            title,
                            body,
                            image: files.image.originalFilename,
                            description,
                            slug,
                            userName: name,
                            userId: id,
                        });
                        return res.status(200).json({ msg: 'Your post has been created successfully', response })
                    } catch (error) {
                        return res.status(500).json({ errors: error, msg: error.message });
                    }
                }
            });
        }
    });
}

module.exports.fetchPosts = async (req, res) => {
    const id = req.params.id; //access user id
    const page = req.params.page;
    const perPage = 5; //later change value to 5 or 10 i.e how many card display on page 1 on pagination (also change in Pagination.js in frontend in if (diff <=3) here)
    const skip = (page - 1) * perPage;
    try {
        const count = await Post.find({ userId: id }).countDocuments();
        const response = await Post.find({ userId: id }).skip(skip).limit(perPage).sort({ updatedAt: -1 }); //-1 means in descending order
        return res.status(200).json({ response: response, count, perPage });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.fetchPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findOne({ _id: id });
        return res.status(200).json({ post });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.updateValidations = [
    body('title').notEmpty().trim().withMessage('Title is required'),
    // body('body').notEmpty().trim().custom((value) => {
    // 	let bodyValue = value.replace(/\n/g, '');
    // 	if (htmlToText(bodyValue).trim().length === 0) {
    // 		return false;
    // 	} else {
    // 		return true;
    // 	}
    // }).withMessage('Body is required'),
    body('body').notEmpty().trim().withMessage('Body is required'),
    body('description').notEmpty().trim().withMessage('Description is required'),
]

module.exports.updatePost = async (req, res) => {
    const { title, body, description, id } = req.body;
    console.log(id)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const response = await Post.findByIdAndUpdate(id, {
                title,
                body,
                description,
            });
            // console.log('Your post has been updated');
            return res.status(200).json({ msg: 'Your post has been updated' });
        } catch (error) {
            return res.status(500).json({ errors: error, msg: error.message });
        }
    }
};

module.exports.updateImage = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, (errors, fields, files) => {
        // console.log(fields); //id
        // console.log(files);
        const { id } = fields;
        const imageErrors = [];
        if (Object.keys(files).length === 0) {
            imageErrors.push({ msg: 'Please choose image' });
        } else {
            const { mimetype } = files.image;
            const split = mimetype.split('/');
            const extension = split[1].toLowerCase();
            if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
                imageErrors.push({ msg: `${extension} is not valid extension.please use png or jpg format image` })
            } else {
                files.image.originalFilename = uuidv4() + '.' + extension;
            }
        }
        if (imageErrors.length !== 0) {
            return res.status(400).json({ errors: imageErrors });
        } else {
            const newPath = __dirname + `/../client/build/image/${files.image.originalFilename}`;
            fs.copyFile(files.image.filepath, newPath, async (error) => {
                if (!error) {
                    try {
                        const response = await Post.findByIdAndUpdate(id, { image: files.image.originalFilename });
                        return res.status(200).json({ msg: 'Your image has been updated', response })
                    } catch (error) {
                        return res.status(500).json({ errors: error, msg: error.message });
                    }
                }
            });
        }
    });
}

module.exports.deletePost = async (req, res) => {
    const id = req.params.id;
    // console.log(id);
    try {
        const response = await Post.findByIdAndRemove(id);
        return res.status(200).json({ msg: 'Your post has been deleted' });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
};

module.exports.home = async (req, res) => {
    const page = req.params.page;
    const perPage = 6;
    const skip = (page - 1) * perPage;
    try {
        const count = await Post.find({}).countDocuments();
        const posts = await Post.find({})
            .skip(skip)
            .limit(perPage)
            .sort({ updatedAt: -1 });
        return res.status(200).json({ response: posts, count, perPage });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
};

module.exports.postDetails = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findOne({ slug: id });
        const comments = await Comment.find({ postId: post._id }).sort({ updatedAt: -1 });
        return res.status(200).json({ post, comments });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.postComment = async (req, res) => {
    const { id, comment, userName } = req.body;
    // console.log(req.body);
    try {
        const response = await Comment.create({
            postId: id,
            comment,
            userName
        });
        return res.status(200).json({ msg: 'Your comment has been published' });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.likePost = (req, res) => {
    const id = req.params.id;
    try {
        Post.findByIdAndUpdate(id, {
            // Post.findByIdAndUpdate(req.body.postId, { //if any error occur please check this line (i think wrong post id is given here)
            $push: { likes: req.user.name } //login user can like post
        }, {
            new: true //mongo return new record
        }).exec((err, result) => {
            if (err) {
                return res.status(422).json({ errors: err, msg: error.message });
            } else {
                return res.status(200).json(result);
            }
        })
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.unlikePost = (req, res) => {
    const id = req.params.id;
    try {
        Post.findByIdAndUpdate(id, {
            // Post.findByIdAndUpdate(req.body.postId, {//if any error occur please check this line (i think wrong post id is given here)
            $pull: { likes: req.user.name } //login user can unlike post
        }, {
            new: true //mongo return new record
        }).exec((err, result) => {
            if (err) {
                return res.status(422).json({ errors: err, msg: error.message });
            } else {
                return res.status(200).json(result);
            }
        })
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.getAllPost = async (req, res) => {
    try {
        const post = await Post.find().exec((err, result) => {
            if (err) {
                return res.status(400).json({ err });
            } else {
                return res.status(200).json({ post: result });
            }
        });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
} 