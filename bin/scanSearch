#!/usr/bin/env node
const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config/database');
const nodeMailer = require('nodemailer');
const Course = require('../models/course');

require('dotenv').config()

mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/auth-template");

// On Connection
mongoose.connection.on('connected', () => {
    log(1, "Connected to database");
  });
  // On Error
  mongoose.connection.on('error', (err) => {
    log(0, 'Database error: '+err);
  });


const URL_TO_SCRAPE = "https://www.coursehero.com/search/results/?search_id=137955862&search_key=e257e3714a4693afcc&stx=math%20211%20erau";

let scrape = async (urlToScrape) => {

    log(2, "Launching Puppeteer instance");
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1366,
        height: 768
    });

    log(2, "Navigating to URL " + urlToScrape);
    await page.goto(urlToScrape);

    log(2, "Interacting with page");
    await page.waitForSelector('#search_app > div.search_results_wrapper > div > div.search-results_main-header > div.search-results_sort > select').then(() => {
        // page.click('#list-view_action > i');
        page.select('#search_app > div.search_results_wrapper > div > div.search-results_main-header > div.search-results_sort > select', 'Most Recent')
    });

    var resultsArray = [];
    const LIST_RESULTS_SELECTOR = "#search_app > div.search_results_wrapper > div";
    const LIST_NAME_SELECTOR = '#search_app > div.search_results_wrapper > div > main > div.search-results_results_container.results > div:nth-child(1) > div:nth-child(2) > ul > li:nth-child(INDEX) > div > ul > li.ch_product_document_title > a';
    const LIST_DATE_SELECTOR = '#search_app > div.search_results_wrapper > div > main > div.search-results_results_container.results > div:nth-child(1) > div:nth-child(2) > ul > li:nth-child(INDEX) > div > ul > li:nth-child(10)';
    const LENGTH_SELECTOR_CLASS = 'search-results_document_list-item ng-scope';

    log(2, "Waiting for results to become available");
    await page.waitForSelector(LIST_RESULTS_SELECTOR);

    let listLength = await page.evaluate((sel) => {
        return document.getElementsByClassName(sel).length;
    }, LENGTH_SELECTOR_CLASS);

    log(2, "Gathering values for " + listLength + " items");
    for (let i = 1; i <= listLength; i++) {
        // change the index for each item in the list
        let nameSelector = LIST_NAME_SELECTOR.replace("INDEX", i);
        let dateSelector = LIST_DATE_SELECTOR.replace("INDEX", i);

        let name = await page.evaluate((sel) => {
            let element = document.querySelector(sel);
            return element ? element.innerHTML : null;
        }, nameSelector);

        let uploadDate = await page.evaluate((sel) => {
            let element = document.querySelector(sel);
            return element ? element.innerText.trim() : null;
        }, dateSelector);

        let documentID = await page.evaluate((sel) => {
            let url = document.querySelector(sel).getAttribute('href').replace('/', '');
            var urlParams = new URLSearchParams(url);
            return urlParams.get('id');
        }, nameSelector);

        resultsArray.push({
            documentName: name,
            documentID: documentID,
            dateUpload: uploadDate,
            dateCrawled: moment(new Date()).format("MM/DD/YYYY")
        });
    }

    browser.close();

    return resultsArray;

};

function uploadDoc(object) {
    //method stub to upload to the server
}

function log(process, message){
    var color, label, padding = "";

    switch(process) {
        case 0: //error
            color = "\x1b[33m";
            label = " ERROR ";
            padding = "    ";
            break;
        case 1:
            color = "\x1b[32m";
            label = " STARTUP ";
            padding = "  ";
            break;
        case 2:
            color = "\x1b[34m";
            label = " SCANNING ";
            padding = " ";
            break;
        case 3:
            color = "\x1b[32m";
            label = " REPORTING ";
            break;
    }
    
    console.log(color + "["+label+"] \x1b[0m"+padding + message);
}

function renderOutput(array, course){
    var htmlString = "<html>";
    htmlString += "<h2>CourseVillain Scan Results</h2>";
    htmlString += "<p>Below are the results of the scan for the course with name <b>" + course.name + "</b>.</p>";
    htmlString += "<p>"+moment(new Date()).format("MM/DD/YYYY")+"</p>";
    htmlString += "<br>";

    if(array.length == 0){
        htmlString += "<hr>No scan results for this scan.</hr>";
    }

    for(var doc of array){
        htmlString += "<hr>";
        htmlString += "<b>Document name: </b>" + doc.documentName + "<br>";
        htmlString += "<b>Document ID:</b> <a href='https://www.coursehero.com/file/" + doc.documentID + "/'>" +  doc.documentID + "</a>";
        htmlString += "";
    }

    htmlString += "</html>";

    return htmlString;
}

/**
 * Main Function Calls
 */
log(1, "Launching CourseVillain");

Course.getAll((err, courses) => {
    if (err) throw err;
    if (courses) {
        //what the hell
        //https://stackoverflow.com/questions/14504385/why-cant-you-modify-the-data-returned-by-a-mongoose-query-ex-findbyid -> 
        //https://stackoverflow.com/questions/7503450/how-do-you-turn-a-mongoose-document-into-a-plain-object
        var modCourses = courses.map(function(model) { return model.toObject(); });

        modCourses.forEach(course => {
            log(2, "Running scan for " + course.name + " on " + course.url);
            scrape(course.url).then((value) => {
                emailResults(value, course);
            });
        });
    }
});

function emailResults(value, course){
    // console.log(value); // Success!
    log(2, "Scanning complete");

    log(3, "Compiling results");

    log(3, "Sending report");
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'erau.content.notification@gmail.com',
            pass: 'Worldwide1!'
        }
    });

    let mailOptions = {
        from: '"CourseVillain" <erau.content.notification@gmail.com>', // sender address
        to: "erau.content.notification@gmail.com",     // list of receivers
        subject: "CourseVillain Results for " + moment(new Date()).format("MM/DD/YYYY"), // Subject line
        text: "Notification", // plain text body
        html: renderOutput(value, course) // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        log(3, "Message sent: " + info.response); 
        process.exit()
   
    });

    log(3, "Done ✔️");    

    // fs.writeFile("../results.json", JSON.stringify(value, null, 4), function (err) {
    //     if (err) {
    //         return console.log(err);
    //     }

    //     console.log("The file was saved!");
    // });
}
