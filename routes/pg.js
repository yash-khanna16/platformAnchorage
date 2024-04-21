const path = require('path');
const express = require('express');
const pgController = require('../controller/pg');
const router = express.Router();

router.get('/guests',pgController.getGuests)
router.get('/admin',pgController.getAdmin)
router.post('/addGuestDetails',pgController.addGuestDetails)
router.post('/admin/deleteGuestDetails',pgController.deleteGuestDetails)
router.post('/admin/sendEmails',pgController.sendEmails)
router.get('/aboutUs',pgController.getAboutUs)
router.get('/roomScheduling',pgController.getRooms)
router.post('/roomScheduling/checkAvailability',pgController.checkAvailability)
router.post('/roomScheduling/addBooking',pgController.addBooking)
router.post('/admin/sendMulticastEmails',pgController.sendMulticastEmails)
router.post('/roomScheduling/deleteRooms',pgController.deleteRooms)
router.post('/roomScheduling/deleteBooking',pgController.deleteBooking)
router.post('/roomScheduling/findGuest',pgController.searchguest)
router.post('/roomScheduling/editBooking',pgController.editBooking)





module.exports = router;