const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer : {type: String, required: true},
  description: { type: String, required: true },
  mainPepper : {type: String, required: true},
  imageUrl: { type: String, required: true },
  heat: { type: Number, min : 1, max : 10, required: true },
  likes: { type: Number, min : 0, required: false },
  dislikes: { type: Number, min : 0, required: false },
  usersLiked: {type: ["String <userId>"], required: false},
  usersDisliked: {type: ["String <userId>"], required: false}

});

module.exports = mongoose.model('Sauce', sauceSchema);
