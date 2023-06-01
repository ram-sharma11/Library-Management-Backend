const express = require('express')
const router = express.Router();
const {authorization} = require("../middleware/auth")
const userController = require('../controllers/userControllers')

router.get("/history",authorization, userController.userHistory)
router.get("/issued-book", authorization, userController.issuedBook)

module.exports = router;