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

router.get('/all/:userId', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Course.getAll((err, courses) => {
        if (err) throw err;
        if (courses) {
            //what the hell
            //https://stackoverflow.com/questions/14504385/why-cant-you-modify-the-data-returned-by-a-mongoose-query-ex-findbyid -> 
            //https://stackoverflow.com/questions/7503450/how-do-you-turn-a-mongoose-document-into-a-plain-object
            
            var newCourses = [];
            
            var modCourses = courses.map(function(model) { return model.toObject(); });

            modCourses.forEach(course => {
                course.pending = "5";
                if(course.creator==req.params.userId)
                {
                    newCourses.push(course);
                }
                console.log(JSON.stringify(course));
            });

            console.log("Returning!", JSON.stringify(newCourses));

            return res.status(200).send({
                data: newCourses,
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

async function waitForButton() {
    await driver.findElement(By.xpath('/html/body/div[6]/button')).click();
}

async function asyncSelenium(URLdoc, namedoc) {
    // Imports and Await statements and all your code here 
    require('chromedriver');
    var delayInMilliseconds = 3000;
    var runAgain = false;
    const assert = require('assert');
    const {Builder, Key, By, until} = require('selenium-webdriver');
        let driver;
            driver = await new Builder().forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless())
            .build();
        // Next, we will write steps for our test. 
        // For the element ID, you can find it by open the browser inspect feature.
        
            // Load the CourseHero page
            await driver.get('https://www.coursehero.com/copyright-infringement/');
            // check the box for my company
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div/div/div/div[2]/div[2]/label')).click();
            // enter the description of the assignments
            await driver.findElement(By.tagName('textarea')).sendKeys(namedoc);
            // enter the URL of the assignment (CAN ADD MORE THAN 1 AT A TIME BUT ZAC SAID TO FLOOD THEM)
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[2]/div[2]/div/div/fieldset/input')).sendKeys(URLdoc);
            // organization name
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[3]/div/div/input')).sendKeys('Embry-Riddle Aeronautical Univeristy');
            // full legal name
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[3]/div/div[2]/input')).sendKeys('Jack Grant');
            // title
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[3]/div[2]/div/input')).sendKeys('Copyright Specialist');
            // address
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[3]/div[2]/div[2]/input')).sendKeys('600 S Clyde Morris Blvd');
            // city
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[3]/div[3]/div/input')).sendKeys('Daytona Beach');
            // state
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[3]/div[3]/div[2]/input')).sendKeys('Florida');
            // zip code
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[3]/div[4]/div/input')).sendKeys('32114');
            // country is default
            // phone
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[3]/div[5]/div/input')).sendKeys('3862901836');
            // email
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[3]/div[5]/div[2]/input')).sendKeys('grantj14@my.erau.edu');
            // section4 checkboxes
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[4]/div[2]/label')).click();
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[4]/div[3]/label')).click();
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[4]/div[4]/label')).click();
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[4]/div[5]/label')).click();
            // digital signature
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[5]/input')).sendKeys('Jack Grant');
            // submit
            await driver.findElement(By.xpath('/html/body/div/div/div/form/div[6]/input')).click();
            //setTimeout(function() {
            //after(() => 
            try {
                setTimeout(async function(){
                    await driver.findElement(By.xpath('/html/body/div[7]/button')).click();
                },500);
            } catch (NoSuchElementError){
                console.log("UGHGHHGHGHGHGHG");
                runAgain = true;
            }
            //}, 2000);
            //await driver.findElement(By.xpath('/html/body/div[6]/button')).click();
            //await driver.findElement(By.className('confirm')).click();
            var isPresent = 0;
            setTimeout(async function(){
                await driver.findElements(By.className('sa-line sa-tip animateSuccessTip')).then(elements => isPresent = (elements.length)); 
                if (isPresent == 0){
                    //run again
                    console.log("failure"+isPresent);
                    runAgain = true;
                } else {
                    console.log("success"+isPresent);
                    //successful
                }
                if (runAgain){
                    asyncSelenium(URLdoc,namedoc);
                    runAgain = false;
                }
            }, 3000);
            // submit
            //await driver.findElement(By.xpath('/html/body/div/div/div/form/div[4]/div[6]/input')).click();
        
        // close the browser after running tests
        setTimeout(function() {
        //after(() => driver && 
            driver.quit();
        }, delayInMilliseconds);
  }

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
            console.log(req.body.URL);
            console.log(req.body.name);
            asyncSelenium(req.body.URL, req.body.name);

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