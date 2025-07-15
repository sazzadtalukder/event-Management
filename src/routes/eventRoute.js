const express = require('express');
const router = express.Router();
const eController = require('../controllers/eventController');

router.post('/',eController.createEvent);
router.get('/:id',eController.getEventDetails)
router.post('/:id/register', eController.registerEvent)
module.exports = router ;