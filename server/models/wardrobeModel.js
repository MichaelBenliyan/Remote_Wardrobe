const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const wardrobeSchema = new Schema({
  type: {type: String, required: true},
  color: {type: String, required: true},
  subType: {type: String, required: true}, 
  wardrobeID: {type: Number, required: true},
  path: {type: String, required: false}
});

module.exports = mongoose.model('Wardrobe', wardrobeSchema);