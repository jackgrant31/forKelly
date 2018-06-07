const mongoose = require('mongoose');
const config = require('../config/database');
var shortid = require('shortid');

const CourseSchema = mongoose.Schema ({
    _id: { type: String, 'default': shortid.generate },
    name: {type: String, required: true},
    url: {type: String, required: true},
    creator: {type: String, required: true},
    frequency: {type: String, required: true},
    lastScan: {type: String}
});

const Course = module.exports = mongoose.model('Course', CourseSchema);

module.exports.getAll = function(callback) {
    const query = {};
    Course.find(query, callback);
}

module.exports.getCourse = function(id, callback) {
    Course.findById(id, callback);
}

module.exports.addCourse = function(newCourse, callback) {
    newCourse.save(callback);
}