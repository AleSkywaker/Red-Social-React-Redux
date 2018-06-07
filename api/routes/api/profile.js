const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Validation
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')
//Load Profile Model
const Profile = require('../../models/Profile')
//Load User Profile
const User = require('../../models/User')

// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get("/test", (req, res) => {
    res.json({message:"profile works"})
});

// @route GET api/profile
// @desc Get current user profile
// @access Private 
router.get('/', passport.authenticate('jwt', {session:false}), (req, res)=>{

    const errors = {};
    Profile.findOne({user: req.user.id})
        .populate('user', ['name', 'avatar'])
        .then(profile=>{
                if(!profile){
                    errors.noprofile = 'No hay datos para este usuario';
                    return res.status(404).json(errors);
                }
                res.json(profile);
        })
        .catch(err => res.status(404).json(err))

})
// @route Get api/profile/all
// @desc Get all profiles
// @access Public 
router.get('/all', (req, res)=>{
   const errors = {};
   Profile.find({})
   .populate('user', ['name', 'avatar'])
    .then(profiles =>{
        if(!profile){
            errors.noprofile = 'No hay perfiles';
            return res.status(404).json(errors);
        }else{
            res.json(profiles)
        } 
    })
    .catch(err => {
        return res.status(404).json({profile: 'No se han encontrado ningun perfil'})
    })
})


// @route Get api/profile/handle/:handle
// @desc Get profile by handle
// @access Public 
router.get('/handle/:handle', (req,res)=>{
    const errors = {};
    Profile.findOne({handle: req.params.handle})
    
    .then(profile => {
        if(!profile){
            errors.noprofile = "There is no profile for this user";
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})
// @route Get api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public 
router.get('/user/:user_id', (req,res)=>{
    Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = "There is no profile for this user";
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json({profile: "There is no profile for this user"}))
})

// @route Post api/profile
// @desc Create or Edit user profile
// @access Private 
router.post('/', passport.authenticate('jwt', {session:false}), (req, res)=>{

    const {errors, isValid} = validateProfileInput(req.body);

    // Check Validation
    if(!isValid){
        // Return any errors with 400
        return res.status(400).json(errors)
    }
    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //Skills - split into array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',')
    } 
    
    // Social
    const profileSocial = {};
    if(req.body.youtube) profileSocial.youtube = req.body.youtube;
    if(req.body.twitter) profileSocial.twitter = req.body.twitter;
    if(req.body.linkedin) profileSocial.linkedin = req.body.linkedin;
    if(req.body.facebook) profileSocial.facebook = req.body.facebook;
    if(req.body.instagram) profileSocial.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
        .then(profile =>{
            if(profile){
                //Update
                Profile.findOneAndUpdate({user: req.user.id}, {$set:profileFields}, {new:true})
                    .then(profile=>{
                        res.json(profile)
                    }).catch(err => res.json("Ha ocurrido un error ", err))
            }else{
                 //Create

                 //Check if handelrs exits
                 Profile.findOne({handle: profileFields.handle})
                    .then(profile =>{
                        if(profile){
                            errors.handle = "Este handle ya esite";
                            res.status(400).json(errors);
                        }
                        //Save Profile
                        new Profile(profileFields).save().then(profile => res.json(profile))
                    })
            }
        })
})
  
// @route Post api/profile/experience
// @desc Add experience to profile
// @access Private 

router.post('/experience', passport.authenticate('jwt', {session:false}), (req,res)=>{
    const {errors, isValid} = validateExperienceInput(req.body);

    // Check Validation
    if(!isValid){
        // Return any errors with 400
        return res.status(400).json(errors)
    }
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            const newExp = {
                title : req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            //Add to exp array
            profile.experience.unshift(newExp);  
            profile.save().then(profile => res.json(profile))
        })
})
// @route Post api/profile/education
// @desc Add education to profile
// @access Private 

router.post('/education', passport.authenticate('jwt', {session:false}), (req,res)=>{
    const {errors, isValid} = validateEducationInput(req.body);

    // Check Validation
    if(!isValid){
        // Return any errors with 400
        return res.status(400).json(errors)
    }
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            const newEdu = {
                school : req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            //Add to exp array
            profile.education.unshift(newEdu);  
            profile.save().then(profile => res.json(profile))
        })
})
// @route DELETE api/profile/:exp_id
// @desc delete experience from profile
// @access Private 

router.delete('/experience/:exp_id', passport.authenticate('jwt', {session:false}), (req,res)=>{
  
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            // Get remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id)


            //Splice out of array
            profile.experience.splice(removeIndex, 1)
            
            //Save
            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(404).json(err))
})
// @route DELETE api/profile/:edu_id
// @desc delete education from profile
// @access Private 

router.delete('/education/:edu_id', passport.authenticate('jwt', {session:false}), (req,res)=>{
  
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            // Get remove index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id)


            //Splice out of array
            profile.education.splice(removeIndex, 1)
            
            //Save
            profile.save().then(profile => res.json(profile))
        })
        .catch(err => res.status(404).json(err))
})

// @route DELETE api/profile/
// @desc delete user and profile
// @access Private 

router.delete('/', passport.authenticate('jwt', {session:false}), (req,res)=>{
  
    Profile.findOneAndRemove({user:req.user.id})
        .then(()=>{
            User.findOneAndRemove({_id: req.user.id})
                .then(()=> res.json({success:true}))
        })
        
})



module.exports = router;