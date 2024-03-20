const path = require('path');
const express = require('express');
const pgController = require('../controller/pg');
const router = express.Router();

router.get('/listings',pgController.getListings)
router.get('/admin',pgController.getAdmin)
router.post('/addListing',pgController.addListing)
router.post('/admin/deleteListing',pgController.deleteListing)













module.exports = router;