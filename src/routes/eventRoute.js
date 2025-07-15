const express = require('express');
const router = express.Router();
const eController = require('../controllers/eventController');

router.post('/',eController.createEvent);
router.get('/upcoming',eController.getUpcomingEvents)
router.get('/:id',eController.getEventDetails)
router.post('/:id/register', eController.registerEvent)
router.delete('/:id/register',eController.cancelRegistration)
router.get('/upcoming',eController.getUpcomingEvents)
router.get('/:id/stats',eController.getEventStats)


module.exports = router ;