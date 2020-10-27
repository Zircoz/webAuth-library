var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  fullname: {type: String, maxlength:100},
  email: {type:String, maxlength: 100},
  displayname: {type: String, maxlength: 20},
  currentChallenge: {type: String},
  authenticator: {
    credentialID: { type: String},
    publicKey: {type: String},
    counter: {type: String},

  },
});

module.exports = mongoose.model("User", UserSchema);
