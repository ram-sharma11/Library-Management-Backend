const express = require("express")
const router = express.Router();

const userRoutes = require('./user')
const adminRoutes = require('./admin')
const bookRoutes = require('./book')
const commonRoutes = require('./common')

router.use('/user', userRoutes)
router.use('/admin', adminRoutes)
router.use('/book', bookRoutes)
router.use('/',commonRoutes)


module.exports = router;
