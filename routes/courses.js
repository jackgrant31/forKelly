const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Course = require('../models/course');
const Document = require('../models/document');
const Token = require('../models/verificationToken')
var crypto = require('crypto');
var nodemailer = require('nodemailer');

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

router.get('/:tagId/documents', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Document.getDocumentsByCourse(req.params.tagId, (err, documents) => {
        if (err) {
            res.status(500).json({
                success: false,
                msg: 'No course found with that ID'
            });
        }

        if (documents) {
            return res.status(200).send({
                data: documents,
                success: true
            });
        } else {
            res.status(500).json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });

    // res.send("tagId is set to " + req.params.tagId);
});

router.get('/:tagId/document/:docId', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Document.getDocumentFromCourse(req.params.tagId, req.params.docId, (err, document) => {
        if (err) {
            res.status(500).json({
                success: false,
                msg: 'No course found with that ID'
            });
        }

        if (document) {
            return res.status(200).send({
                data: document,
                success: true
            });
        } else {
            res.status(500).json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });

    // res.send("tagId is set to " + req.params.tagId);
});

router.post('/:tagId/document/:docId', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    try {
        let updatedState = {
            "reviewed": true,
            "reported": req.body.reported
        };

        if(req.body.reported == true){
            console.log("Submitting takedown form request...");
            /**
             * @TODO
             * 
             * This is where you will need to call your Selenium 
             * code to fill the form for demonstration purposes only
             */
        }

        Document.updateDocumentReviewStatus(req.params.docId, updatedState, (err, document) => {
            if (err) res.status(500).json({
                success: false,
                msg: 'Failed to update document'
            });
            else {
                res.status(200).json({
                    success: true,
                    msg: "Successfully updated document"
                });
                // });
            }
        });
    } catch (e) {
        //this will eventually be handled by your error handling middleware
        res.json({
            success: false,
            msg: `Encountered and Unknown error: ${e}`
        })
        next(e)
    }

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