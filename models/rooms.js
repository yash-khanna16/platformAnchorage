const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema({
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    bookings: [
      {
        guestName: { type: String, required: true },
        guestPhone: { type: String, required: true },
        checkInDateTime: { type: Date, required: true },
        checkOutDateTime: { type: Date, required: true },
      },
    ],
  });
  
// const UserSchema = new Schema({
//     username: String,
//     password: String
// })

// const Users = mongoose.model('Users',UserSchema);

// module.exports = Users;

module.exports = mongoose.model('room',roomSchema);

