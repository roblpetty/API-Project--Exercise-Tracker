const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require("shortid");

const exerciseSchema = new mongoose.Schema({
  "user_id": { "type": String, "required": true },
  "description": { "type": String, "required": true },
  "duration": { "type": Number, "required": true },
  "_id": { "type": String, "default": shortid.generate },
  "date": { "type": Date, "required": true },
  
});

module.exports = mongoose.model("Exercise", exerciseSchema);
