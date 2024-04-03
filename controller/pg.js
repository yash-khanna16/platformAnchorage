const guests = require('../models/guests')
const rooms = require('../models/rooms')

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
            res.render('admin')
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
    try {
        const { customMailBody, customMailSubject } = req.body;
        // console.log(customMailBody);
        let emailList = [];

        const gotUser = await guests.find({})
        gotUser.forEach(guest => {
            // console.log(guest.email);
            if (guest.email !== '') {
                emailList.push(guest.email.trim());
            }
        });
        // console.log(guests)

        const params = {
            Source: process.env.AWS_SES_SENDER,
            Destination: {
                ToAddresses: emailList,
            },
            ReplyToAddresses: [],
            Message: {
                Body: {
                    // Html: {
                    //     Charset: 'UTF-8',
                    //     Data: customMailBody ? customMailBody : '<h1>This is the body of my email!</h1>',
                    // },
                    Text: {
                        Charset: "UTF-8",
                        Data: customMailBody ? customMailBody : "This is the body of my email!",
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: customMailSubject ? customMailSubject : "default subject",
                },
            },
        };

        // Send email using AWS SES
        const response = await AWS_SES.sendEmail(params).promise();
        console.log('Email has been sent!', response);
        res.redirect('/platformAnchorage/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending email');
    }

};

module.exports.getAboutUs = (req, res, next) => {
    res.render('about')
}


module.exports.getRooms = (req, res, next) => {
    rooms.find({})
        .then((rooms) => {
            res.render('rooms', {
                rooms
            });
        })
        .catch(err => {
            res.send("no room details found");
        })
}

module.exports.checkAvailability = async (req, res, next) => {
    const { checkInDateTime, checkOutDateTime } = req.body;

    try {
        const allRooms = await rooms.find({}); // Get all rooms

        const availableRooms = await Promise.all(allRooms.map(async (room) => {
            const roomAvailable = await isRoomAvailable(room.roomNumber, checkInDateTime, checkOutDateTime);
            if (roomAvailable) {
                // console.log(room)
                return room; // Return the room if available
            }
        }));

        const filteredRooms = availableRooms.filter(room => room); // Remove undefined elements
        // console.log(filteredRooms);
        console.log(filteredRooms)
        res.render('rooms', {
            filteredRooms: filteredRooms 
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).send('Error fetching rooms');
    }
};

async function isRoomAvailable(roomNumber, checkInDateTime, checkOutDateTime) {
    const existingBooking = await rooms.findOne({
        roomNumber: roomNumber,
        bookings: {
            $not: {
                $elemMatch: {
                    $or: [
                        {
                            $and: [
                                { checkInDateTime: { $lte: checkInDateTime } },
                                { checkOutDateTime: { $gte: checkInDateTime } },
                            ]
                        },
                        {
                            $and: [
                                { checkInDateTime: { $lte: checkOutDateTime } },
                                { checkOutDateTime: { $gte: checkOutDateTime } },
                            ]
                        },
                        {
                            $and: [
                                { checkInDateTime: { $gte: checkInDateTime } },
                                { checkOutDateTime: { $lte: checkOutDateTime } },
                            ]
                        }
                    ]
                }
            }
        }
    });
    return existingBooking;
}

module.exports.addBooking = async (req, res, next) => {
    const { roomNumber, guestName, guestPhone, checkInDateTime, checkOutDateTime } = req.body
    console.log("inside addBooking")
    let newRoomDetail = new rooms({
        roomNumber, bookings: [
            {
                guestName,
                guestPhone,
                checkInDateTime,
                checkOutDateTime
            },
        ]
    })
    const atleastOneEntry = await rooms.findOne({ roomNumber: roomNumber });
    if (!atleastOneEntry) {
        await newRoomDetail.save();
        console.log("room details added successfully");
        res.redirect('/platformAnchorage/roomScheduling');
    }
    else {
        const roomAvailable = await isRoomAvailable(roomNumber, checkInDateTime, checkOutDateTime)
        console.log(roomAvailable)
        if (!roomAvailable) {
            console.log('Room is not available for the specified date and time range');
            res.redirect('/platformAnchorage/roomScheduling');
            // location.reload();

        }

        else {
            await rooms.updateOne(
                { roomNumber: roomNumber },
                {
                    $push: {
                        bookings: {
                            guestName,
                            guestPhone,
                            checkInDateTime: checkInDateTime,
                            checkOutDateTime: checkOutDateTime
                        },
                    },
                }
                // options
            );
            res.redirect('/platformAnchorage/roomScheduling');
            // location.reload();
        }
    }
    
    
}


module.exports.sendMulticastEmails = async (req, res, next) => {
    try {
        const { id } = req.body;
        // console.log(customMailBody);
        let emailList = [];

        const gotUser = await guests.find({_id:id})
        gotUser.forEach(guest => {
            // console.log(guest.email);
            if (guest.email !== '') {
                emailList.push(guest.email.trim());
            }
        });
        // console.log(guests)

        const params = {
            Source: process.env.AWS_SES_SENDER,
            Destination: {
                ToAddresses: emailList,
            },
            ReplyToAddresses: [],
            Message: {
                Body: {
                    // Html: {
                    //     Charset: 'UTF-8',
                    //     Data: customMailBody ? customMailBody : '<h1>This is the body of my email!</h1>',
                    // },
                    Text: {
                        Charset: "UTF-8",
                        Data:"Welcome to Anchorage by Captain Vishal Khanna!",
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: "Check In",
                },
            },
        };

        // Send email using AWS SES
        const response = await AWS_SES.sendEmail(params).promise();
        console.log('Email has been sent!', response);
        res.redirect('/platformAnchorage/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending email');
    }

};
module.exports.deleteRooms= (req, res, next) => {
    const { id } = req.body;
    console.log(id);
    rooms.deleteOne({ roomNumber: id })
        .then(() => {
            res.render('rooms',{rooms})
        })
        .catch(err => {
            console.log("could not delete")
        })
}