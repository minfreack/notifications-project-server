const express = require('express');
const userRoutes = require('./users')
const notificationRoutes = require('./notifications')
const router = express.Router();

router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes );


module.exports =  router;