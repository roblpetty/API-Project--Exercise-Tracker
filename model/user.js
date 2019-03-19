const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const userSchema = new mongoose.Schema({
  "username": { "type": String, "unique": true, "required": true},
  "_id": { "type": String, 'default': shortid.generate }
});

module.exports = mongoose.model("User", userSchema);
