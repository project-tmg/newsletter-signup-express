# newsletter-signup-express
Created app which will sign up user to a newsletter list using node js, express, HTML/CSS and JS
Mailchimp used as the server provider.

Package used:
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');

Task carried out:
- created page that collects user name, email and method type
- 2 Method of post:
  1 - using defaut HTTPs post method
  2 - using mailchimp package
- Success and Failuer based on mailchimp response
- API key hidden using envioment variable (process.env.) so it is not part of the repository
- Used Cyclic as host/backend server
- git init, add ., commit -m and push -u origin master
