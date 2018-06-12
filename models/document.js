const mongoose = require('mongoose');
const config = require('../config/database');
var shortid = require('shortid');

const DocumentSchema = mongoose.Schema ({
    _id: { type: Number, required: true },
    scanId: {type: String, required: true},
    courseId: {type: String, required: true},
    status: {type: String, required: true},
    name: {type: String, required: true},
    uploadDate: {type: String, required: true},
    scanDate: {type: String, required: true}
});

const Document = module.exports = mongoose.model('Document', DocumentSchema);

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