const express = require('express')
const router = express.Router();
const {authorization,
permission
} = require("../middleware/auth")
const commonController = require("../controllers/commonController")

router.post("/register", commonController.register);
router.post("/login", commonController.login);
router.get("/profile",authorization,  commonController.getProfile);
router.get("/blacklisted-user",authorization, permission, commonController.blockedUsers)
router.get("/all-books",authorization,permission, commonController.getAllBooks)

module.exports = router;