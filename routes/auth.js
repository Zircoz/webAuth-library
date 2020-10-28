var express = require('express');
var router = express.Router();
const SimpleWebAuthnServer = require('@simplewebauthn/server');
var mongoose = require('mongoose');
var User = require("../models/user");

import {
  generateAttestationOptions,
  verifyAttestationResponse,
} from '@simplewebauthn/server';

const rpName = 'webAuth-library';
const rpID = 'localhost';
const origin = `https://`+rpID;

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/generate-attestation-options', function(req,res, next){
  User.exists({ displayname: req.body.username, email: req.body.email }, function(err, result) {
  if (err) {
    res.send(err);
  } else {
    if(result==false) {
      var new_user = new User({ fullname: req.body.fullname, email: req.body.email, displayname: req.body.displayname });
      user1 = await new_user.save();
      user1.then(
      const options = generateAttestationOptions({
        rpName,
        rpID,
        userID: user1.email, // refine this
        userName: user1.displayname,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
        attestationType: 'indirect',
      // Prevent users from re-registering existing authenticators
      /*
      excludeCredentials: devices.map(dev => ({
        id: dev.credentialID,
        type: 'public-key',
        // Optional
      })),
      */
      });
      let userWithCred = await User.findOneAndUpdate({email: user1.email}, {currentChallenge: options.challenge}, {new: true}).then(
        let usersCookieData = {
          email: user1.email
        }
        res.cookie("userData", usersCookieData, {maxAge: 120000});
        res.send(options);
      );
    )
    }
  }
});
})
//generate-attestation-options POST ENDS

//verify-attestation POST starts
router.post('/verify-attestation', function(req, res, next){
  
})
