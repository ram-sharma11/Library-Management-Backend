const express = require('express')
const router = express.Router();
const {authorization
,permission
} = require("../middleware/auth")
const adminController = require('../controllers/adminControllers')

router.post("/create-subadmin",authorization,permission, adminController.createSubAdmin);
router.patch("/give-responsibility/:id",authorization,permission, adminController.giveReposibility);


module.exports = router;
