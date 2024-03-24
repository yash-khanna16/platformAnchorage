
const guests = require('../models/guests')
module.exports.getGuests = (req, res, next) => {
    guests.find({})
        .then((guests) => {
            res.render('guests', {
                guests
            });
        })
        .catch(err => {
            res.send("no guests found");
        })
}

module.exports.getAdmin = (req, res, next) => {
    if (req.user) {
        guests.find({})
            .then((guests) => {
                // console.log(guests);
                res.render('admin', {
                    guests
                });
            })
            .catch(err => {
                res.send("no guests found");
            })
    }
    else {
        res.render("login");
    }
}

module.exports.addGuestDetails = async (req, res, next) => {
    const { pname, email, rank, phoneNumber, companyName } = req.body;
    let newGuest = new guests({ pname, email, rank, phoneNumber, companyName });

    try {
        const existingGuest = await guests.findOne({ phoneNumber: phoneNumber });
        if (existingGuest) {
            console.log("existing guest");
            res.redirect('/platformAnchorage/admin');
        } else {
            await newGuest.save();
            console.log("guest details added successfully");
            res.redirect('/platformAnchorage/admin');
        }
    } catch (err) {
        console.log("Error:", err);
        res.send(err);
    }
}
module.exports.deleteGuestDetails = (req, res, next) => {
    const { id } = req.body;
    console.log(id);
    guests.deleteOne({ _id: id })
        .then(() => {
            res.render('guests')
        })
        .catch(err => {
            console.log("could not delete")
        })
}

const AWS = require('aws-sdk');
require('dotenv').config();
require('aws-sdk/lib/maintenance_mode_message').suppress = true; /*836(gzipped: 492)*/
const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
};
const AWS_SES = new AWS.SES(SES_CONFIG);
module.exports.sendEmails = async (req, res, next) => {
    let emailList = []
    guests.find({})
        .then((guests) => {
            console.log(guests)
            guests.forEach(guest => {
                console.log(guest.email)
                emailList.push(guest.email)
            });
            console.log(emailList)
            // console.log(guests[0].email)
        })
        .catch(err => {
            res.send("no guests found");
        })
    let recipientEmail='yashkhanna16062002@gmail.com'
    let params = {
        Source: process.env.AWS_SES_SENDER,
        Destination: {
            ToAddresses: [
                recipientEmail
            ],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: '<h1>This is the body of my email!</h1>',
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "This is the body of my email!"
                },
            },
                Subject: {
                    Charset: 'UTF-8',
                    Data: "Hello, yash!",
                }
        },
    };
        try {
            const res = await AWS_SES.sendEmail(params).promise();
            console.log('Email has been sent!', res);
        }    
        catch(error) {
                console.error(error);
            }
}
