const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Course = require('../models/course');
const Token = require('../models/verificationToken')
var crypto = require('crypto');
var nodemailer = require('nodemailer');

// Profile
router.get('/all', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Course.getAll((err, courses) => {
        if (err) throw err;
        if (courses) {
            //what the hell
            //https://stackoverflow.com/questions/14504385/why-cant-you-modify-the-data-returned-by-a-mongoose-query-ex-findbyid -> 
            //https://stackoverflow.com/questions/7503450/how-do-you-turn-a-mongoose-document-into-a-plain-object
            var modCourses = courses.map(function(model) { return model.toObject(); });

            modCourses.forEach(course => {
                course.pending = "5";
                console.log(JSON.stringify(course));
            });

            console.log("Returning!", JSON.stringify(modCourses));

            return res.status(200).send({
                data: modCourses,
                success: true
            });
        }
    });
});

router.get('/:tagId', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Course.getCourse(req.params.tagId, (err, course) => {
        if (err){
            res.status(500).json({
                success: false,
                msg: 'No course found with that ID'
            });
        }
        
        if(course) {
            return res.status(200).send({
                data: course,
                success: true
            });
        }else{
            res.status(500).json({
                success: false,
                msg: 'No course found with that ID'
            });
        }
    });
    
    // res.send("tagId is set to " + req.params.tagId);
});

router.post('/create', async (req, res, next) => {
    try {
        let newCourse = new Course({
            name: req.body.name,
            url: req.body.url,
            creator: req.body.creator,
            frequency: req.body.frequency
        });
        let course;

        Course.addCourse(newCourse, (err, course) => {
            if (err) res.status(500).json({
                success: false,
                msg: 'Failed to register course'
            });
            else {
                res.status(200).json({
                    success: true,
                    msg: "Successfully added course!"
                });
                // });
            }
        })
    } catch (e) {
        //this will eventually be handled by your error handling middleware
        // res.json({success: false, msg: `Encountered and Unknown error: ${err}`})
        next(e)
    }
});

module.exports = router;