const mongoose = require('mongoose');
const config = require('../config/database');
var shortid = require('shortid');

const DocumentSchema = mongoose.Schema ({
    _id: { type: Number, required: true },
    scanId: {type: String, required: true},
    courseId: {type: String, required: true},
    status: {type: Object, required: true},
    name: {type: String, required: true},
    uploadDate: {type: String, required: true},
    scanDate: {type: String, required: true}
});

const Document = module.exports = mongoose.model('Document', DocumentSchema);

module.exports.getAll = function(callback) {
    const query = {};
    Document.find(query, callback);
}

module.exports.getDocument = function(id, callback) {
    Document.findById(id, callback);
}

module.exports.getDocumentsByCourse = function(courseId, callback) {
    const query = {courseId: courseId, 'status.reviewed': false };
    Document.find(query, callback);
}

module.exports.getDocumentFromCourse = function(courseId, documentId, callback) {
    const query = {courseId: courseId, _id: documentId};
    Document.findOne(query, callback);
}

module.exports.updateDocumentReviewStatus = function(documentId, newState, callback) {
    const query = { _id: documentId };
    Document.findOneAndUpdate(query, { status: newState }, callback);
}

module.exports.addDocument = function(newDocument, callback) {
    newDocument.save(callback);
}