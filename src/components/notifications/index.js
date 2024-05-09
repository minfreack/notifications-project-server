const express = require('express');
const router = express.Router();
const NotificationController = require('./controller')

const onCreateNotification = (req, res) => {
    NotificationController.newNotification(req.body)
        .then((result) => res.status(result.status).json(result.data))
        .catch((err) => res.status(500).json(err));  
};

const onReadNotification = (req, res) => {
    NotificationController.readNotification(req.body)
        .then((result) => res.status(result.status).json(result.data))
        .catch((err) => res.status(500).json(err));  
};

const onGetUserNotifications = (req, res) => {
    const id = req.query.id;
    NotificationController.getUserNotifications(id)
        .then((result) => res.status(result.status).json(result.data))
        .catch((err) => res.status(500).json(err));  
};


router.post('/notification', onCreateNotification);
router.patch('/notification', onReadNotification);
router.get('/notifications', onGetUserNotifications);
// router.post('/user', onGetUser);

module.exports = router;