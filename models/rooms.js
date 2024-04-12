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
        guestName: { type: String, /*required: true*/ },
        guestPhone: { type: String, /*required: true*/ },
        checkInDateTime: { type: Date, /*required: true*/ },
        checkOutDateTime: { type: Date, /*required: true*/ },
        companyName: { type: String, /*required: true*/ },
        vessel: { type: String, /*required: true*/ },
        remark: { type: String, /*required: true*/ },
        additional: { type: String, /*required: true*/ },
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

