const path = require('path');
const express = require('express');
const pgController = require('../controller/pg');
const router = express.Router();

router.get('/guests',pgController.getGuests)
router.get('/admin',pgController.getAdmin)
router.post('/addGuestDetails',pgController.addGuestDetails)
router.post('/admin/deleteGuestDetails',pgController.deleteGuestDetails)













module.exports = router;