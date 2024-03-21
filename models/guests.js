const mongoose = require('mongoose');
const { Schema } = mongoose;

const guestSchema = new Schema({
    pname: String,
    email: String,
    rank: String,
    phoneNumber: Number,
    companyName: String
});

// const UserSchema = new Schema({
//     username: String,
//     password: String
// })

// const Users = mongoose.model('Users',UserSchema);

// module.exports = Users;

module.exports = mongoose.model('guests',guestSchema);

