const mongoose = require('mongoose');
const { Schema } = mongoose;

const listingsSchema = new Schema({
    title: String,
    description: String,
    ownerName: String,
    ownerPhone: Number,
    pictureURL: String
});

// const UserSchema = new Schema({
//     username: String,
//     password: String
// })

// const Users = mongoose.model('Users',UserSchema);

// module.exports = Users;

module.exports = mongoose.model('listings',listingsSchema);

