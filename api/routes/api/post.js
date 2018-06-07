const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')

//Load Post model
const Post = require('../../models/post')
//Load Profile model
const Profile = require('../../models/Profile')

//Validation
const validatePostInput = require('../../validation/post')

// @route GET api/post
// @desc Get posts
// @access Public
router.get("/", (req, res) => {
    Post.find()
    .sort({date:-1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostfound:"No posts found"}))
});

// @route GET api/post/:id
// @desc Get posts by id
// @access Public
router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({nopostfound:"No post found with that ID"}))
});

// @route POST api/post
// @desc create post
// @access Private
router.post("/", passport.authenticate('jwt', {session:false}), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if(!isValid){
        // Return any errors with 400
        return res.status(400).json(errors)
    }
    const newPost = new Post({
         text: req.body.text,
         name: req.body.name,
         avatar:req.body.avatar,
         user: req.user.id
    })
    newPost.save().then(post => res.json(post))
});

// @route DELETE api/post/:id
// @desc Delete posts by id
// @access Private
router.delete("/:id", passport.authenticate('jwt', {session:false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile=>{
            Post.findById(req.params.id)
             .then(post => {
                 //Check for post owner
                 if(post.user.toString() !== req.user.id){
                     return res.status(401).json({notauthorized: 'User not authorized'})
                 }
                 //Delete
                 post.remove().then(()=> res.json({success: true}))
             })
             .catch(err => res.status(404).json({postnotfound:'No post found'}))
        })
    
});
// @route POST api/post/like/:id
// @desc Like post
// @access Private
router.post("/like/:id", passport.authenticate('jwt', {session:false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile=>{
            console.log("id por parametros", req.params.id);
            Post.findById(req.params.id)
             .then(post => {
                 //Check if user has already liked this post
              if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0){
                return res.status(400).json({alreadyliked: "Usuario already liked this post"})
              }
              // add user id to likes array
              post.likes.unshift({user: req.user.id})

              post.save().then(post => res.json(post));
                 
             })
             .catch(err => res.status(404).json({postnotfound:'No post found'}))
        })
    
});


// @route POST api/post/unlike/:id
// @desc unLike post
// @access Private
router.post("/unlike/:id", passport.authenticate('jwt', {session:false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile=>{
            console.log("id por parametros", req.params.id);
            Post.findById(req.params.id)
             .then(post => {
                 //Check if user has already liked this post
                 console.log("post", post)
              if(post.likes.filter(like=>like.user.toString() === req.user.id).length === 0){
                return res.status(400).json({notliked: "No has dicho que te gusta esta publicacion"})
              }
              // Get remove index
                const removeIndex = post.likes
                    .map(item => item.user.tostring())
                    .indexOf(req.user.id)

                    console.log("removeIndex", removeIndex)
              //Splice out of array
              post.likes.splice(removeIndex,1)  
              
              //Save
              post.save().then(post=> res.json(post))
             })
             .catch(err => res.status(404).json({postnotfound:'No post found'}))
        })
    
});

module.exports = router;