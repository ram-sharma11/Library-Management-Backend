const express = require('express')
const router = express.Router();
const {authorization, permission} = require("../middleware/auth")
const bookController = require("../controllers/bookControllers")

router.post("/add-book",authorization, permission, bookController.addBook);
router.get("/show-books",authorization,bookController.showBook);
router.delete("/delete-book/:bookId",authorization, permission, bookController.deleteBook);
router.patch("/update-book/:bookId",authorization, permission, bookController.updateBook);

router.post("/assign-book",authorization, permission, bookController.assignBook);
router.post("/return-book",authorization, permission, bookController.returnBook);

router.get("/history/:bookId",authorization,permission, bookController.bookHistory );
router.get("/all-issued-book" , authorization, permission, bookController.userAllWithBook)


module.exports = router;