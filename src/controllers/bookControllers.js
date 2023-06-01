const { errorResponse } = require("../utils/common")
const { OK } = require("../constants/statusCodes")
const { bookCreate,
    bookAssign,
    bookUpdate,
    bookDelete,
    bookReturn,
    getBook,
    historyOfBook,
    assignedBook 
} = require("../services/bookServices")

module.exports.addBook = async (req, res) => {
    try {
        const response = await bookCreate(req.body)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.showBook = async (req, res) => {
    try {
        const response = await getBook(req)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.deleteBook = async (req, res) => {
    try {
        const response = await bookDelete(req.params)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.updateBook = async (req, res) => {
    try {
        const response = await bookUpdate(req.params,req.body)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.assignBook = async (req, res) => {
    try {
        const response = await bookAssign(req.body)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.returnBook = async (req, res) => {
    try {
        const response = await bookReturn(req.body)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.bookHistory = async (req, res) => {
    try {
        const response = await historyOfBook(req.params)
        return res.status(OK).json(response);
    } catch (err) {
        return errorResponse(err, res);
    }
};

module.exports.userAllWithBook = async (req, res) => {
    try {
      const response = await assignedBook(req.user)
      return res.status(OK).json(response);
    } catch (err) {
      return errorResponse(err, res);
    }
  }