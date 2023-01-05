//require packages
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');
require("dotenv").config();

//initialise
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

const MAPI_KEYA = process.env.API_KEY1;
const MAPI_KEYB = process.env.API_KEY2;
const MLIST_ID = process.env.LIST_ID;
const MAPI_SERVER = process.env.API_SERVER;

//mailchimp
mailchimp.setConfig({
    apiKey: MAPI_KEYA,
    server: MAPI_SERVER
});


//directs
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailAddress = req.body.emailAddress;
    const methodType = Number(req.body.methodType);

    if (!!firstName && !!lastName && !!emailAddress) {
        if (methodType == 1) {
            //mailchimp package method
            const run = async () => {
              const response = await mailchimp.lists.batchListMembers(MLIST_ID, {
                members: [{
                    email_address: emailAddress,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }],
              });
              console.log("methodType - 1");
              console.log(response);
              if (response.error_count >= 1 ) {
                  res.sendFile(__dirname + '/failure.html');
              } else {
                  res.sendFile(__dirname + '/success.html');
              }
            };
            run();
        } else {
            //raw request method
            const mailchimpData = {
                members: [{
                    email_address: emailAddress,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }]
            };

            const jsonData = JSON.stringify(mailchimpData);

            //post
            const url = 'https://' + MAPI_SERVER + '.api.mailchimp.com/3.0/lists/' + MLIST_ID;
            const options = {
                method: "POST",
                auth: MAPI_KEYB
            };
            console.log("methodType - 2");
            const httpsPostRequest = https.request(url, options, function(response) {
                response.on('data', function(data) {
                    var rawRequestData = JSON.parse(data);
                    console.log(rawRequestData);
                    if (response.statusCode == 200) {
                        if (response.error_count >= 1) {
                            res.sendFile(__dirname + '/failure.html');
                        } else {
                            res.sendFile(__dirname + '/success.html');
                        }
                    } else {
                        res.sendFile(__dirname + '/failure.html');
                    }
                });
            });

            httpsPostRequest.write(jsonData);
            httpsPostRequest.end();

        }
    }
});

app.post("/failure", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function () {
    console.log('server started');
});
