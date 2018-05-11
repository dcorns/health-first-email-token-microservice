/**
 * issue-token
 * Created by dcorns on 8/20/17
 * Copyright © 2017 Dale Corns
 * MIT Licensed
 */
'use strict';
const jwt = require('jwt-simple');
//const secret = 'the big secret!';
const secret = process.env.SECRET;
const exp = process.env.EXP * 60 * 60000 + Date.now();
const iss = process.env.ISS;
module.exports = (emailaddress) => {
  const payload = {
    "iss":iss,
    "exp": exp,
    "iat": Date.now(),
    "email": emailaddress
  };
  return jwt.encode(payload, secret, 'HS512');
};