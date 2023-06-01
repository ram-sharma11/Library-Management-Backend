const bookModel = require("../models/book")
const issueModel = require("../models/issue")
const userModel = require("../models/user")
const blockedModel = require("../models/blacklistUser")
const CustomError = require('../utils/customError');
const statusCode = require("../constants/statusCodes");
const _ = require("lodash")


exports.bookCreate = async (requestData) => {
    const isBookExists = await bookModel.findOne({ bookId: requestData.bookId })
    if (isBookExists) {
        throw new CustomError("Book Already Exists", statusCode.UN_PROCESSABLE_ENTITY);
    }
    const newBook = await bookModel.create({
        bookId: requestData.bookId,
        bookName: requestData.bookName,
        author: requestData.author,
        description: requestData.description
    })
    return {
        status: true,
        message: "Book Registered Successfully",
        data: newBook,
    };
}

exports.getBook = async (req) => {
    let tag = "Book not issued"
    if(req.user.noOfAssignedBooks > 0){
        tag = `${req.user.noOfAssignedBooks} book issued` 
    }
    let allbooks = await bookModel.find()
    const books = await bookModel.count()

    if(req.query.bookName){
        allbooks = allbooks.filter((book)=> book.bookName.includes(req.query.bookName));
    }
    return {
        status: true,
        message: `Total books in Library is ${books}`,
        tag: `${tag}`,
        AllBooks: allbooks,
    };

}

exports.bookUpdate = async (reqParam, requestData) => {
    const book = await bookModel.findOne({ bookId: reqParam.bookId });
    book.bookName = requestData.bookName || book.bookName;
    book.author = requestData.author || book.author;
    book.description = requestData.description || book.description;
    book.save()
    return {
        status: true,
        message: "Book Updated Successfully",
        data: book,
    };
}

exports.bookDelete = async (requestData) => {
    const book = await bookModel.deleteOne({ bookId: requestData.bookId })
    return {
        status: true,
        message: "Book Deleted Successfully",
        data: book,
    };
}

exports.bookAssign = async (requestData) => {
    const { bookId, email } = requestData
    const user = await userModel.findOne({ email: email })
    const book = await bookModel.findOne({ bookId: bookId })
    const blockedUser = await blockedModel.findOne({userId : user._id})
    if (blockedUser) {
        throw new CustomError("user has been Blocked due to late submission of book.", statusCode.UN_PROCESSABLE_ENTITY);
    }
    if (user.noOfAssignedBooks >= 5) {
        throw new CustomError("User has reached to the maximum limit", statusCode.UN_PROCESSABLE_ENTITY);
    }
    if (!book.isAvailable) {
        throw new CustomError("This book is not available. Will be available soon..", statusCode.UN_PROCESSABLE_ENTITY)
    }
    await issueModel.create({
        book: book._id,
        user: user._id
    })
    user.noOfAssignedBooks = user.noOfAssignedBooks + 1 ;
    book.isAvailable = false
    user.save()
    book.save()
    return {
        status: true,
        message: `Book has been Assigend to ${email}`,
        data: book
    };
}

exports.bookReturn = async (requestData) => {
    const { bookId, email } = requestData
    const user = await userModel.findOne({ email: email })
    const book = await bookModel.findOne({ bookId: bookId })
    userhistory = await issueModel.find({ user: user._id })
    issuedbook = userhistory.find(issuedbook => issuedbook.isBookReturned == false)
    issuedbook.isBookReturned = true
    issuedbook.returnDate = new Date()  
    issuedbook.save();
    let diff = (issuedbook.returnDate - issuedbook.issueDate)/ (1000 * 60 * 60 * 24)
    if(Math.floor(diff) > 7){
        const exits = await blockedModel.findById(user._id)
        if(!exits){await blockedModel.create({
            user: user._id
        })}
    }
    user.noOfAssignedBooks = user.noOfAssignedBooks - 1 ;
    book.isAvailable = true
    user.save();
    book.save();
    return {
        status: true,
        message: `Book has been returned by ${email}`,
        data: book
    };

}

exports.historyOfBook = async (requestData) => {
    const book = await bookModel.findOne({ bookId: requestData.bookId })
    const bookHistory = await issueModel.find({ book: book._id}).populate({ path: "user"}).populate({path: "book" })
    return {
        status: true,
        message: "Book History",
        data: bookHistory
    };
}

exports.assignedBook = async (requestData) => {
    const all = await issueModel.find().populate({ path: "user" }).populate({path: "book"});
    const data = _.filter( all,p => p.isBookReturned == false)
    return {
        status: true,
        message: "all user with assigned books",
        data: data
    };
}