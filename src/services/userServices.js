const userModel = require("../models/user")
const issueModel = require("../models/issue")
const bookModel = require("../models/book")
const blockedModel = require("../models/blacklistUser")
const ExcelJS = require('exceljs');
const CustomError = require('../utils/customError');
const statusCode = require("../constants/statusCodes")
const path = require("path")
const PATH = path.join('/download')
const _ = require("lodash")
const fns = require('date-fns')

const { JOIValidationRegister,
    JOIValidationlogin,
    generatePasswordHash,
    createJWT,
    comparePasswordHash
} = require("../utils/common");
const { findOne } = require("../models/user");
const { date } = require("joi");

exports.registerUser = async (requestData) => {

    // check the user send data is in required format
    const value = JOIValidationRegister(requestData);
    if (value.error) {
        console.log(value.error.details[0].message)
        throw new CustomError("VALIDATION ERROR", statusCode.BAD_REQUEST, value.error.message.split('. '));
    };
    // cheeck is email already exists
    const isEmailExists = await userModel.findOne({ email: requestData.email })
    if (isEmailExists) {
        throw new CustomError("EMAIL ALREADY EXISTS", statusCode.UN_PROCESSABLE_ENTITY);
    }
    const hashedPassword = await generatePasswordHash(requestData.password)
    let newUser
    if (requestData.role) {
        newUser = await userModel.create({
            name: requestData.name,
            email: requestData.email,
            password: hashedPassword,
            phone: requestData.phone,
            role: requestData.role
        })
    } else {
        newUser = await userModel.create({
            name: requestData.name,
            email: requestData.email,
            password: hashedPassword,
            phone: requestData.phone,
        })
    }
    return {
        status: true,
        message: "User Registered Successfully",
        data: newUser,
    };
}

exports.loginUser = async (requestData) => {
    // check the user send data is in required format
    const value = JOIValidationlogin(requestData);
    if (value.error) {
        throw new CustomError("validation Error", statusCode.BAD_REQUEST, value.error.message.split('. '));
    };
    const existingUser = await userModel.findOne({ email: requestData.email })
    if (!existingUser) {
        throw new CustomError("Invalid Login Credentials", statusCode.UNAUTHORIZED,)
    }

    const matchPassword = await comparePasswordHash(requestData.password, existingUser.password)
    if (!matchPassword) {
        throw new CustomError("Invalid Login Credentials", statusCode.UNAUTHORIZED)
    }
    const token = await createJWT({ emial: existingUser.email, id: existingUser._id, })

    return {
        status: true,
        message: "User Login Successfully",
        token,
        data: existingUser,
    };
}

exports.givePermission = async (requestData) => {
    const user = await userModel.findById(requestData.id)
    if (!user) {
        throw new CustomError("User Not found", statusCode.NOT_FOUND,)
    }
    user.havePermission = !user.havePermission;
    await user.save();
    return {
        status: true,
        message: "Permission changed.",
        data: user,
    };
}

exports.fetchUserProfile = async (requestData) => {
    return {
        status: true,
        message: "user Profile",
        data: requestData,
    };
}

exports.userBlocked = async () => {
    const all = await blockedModel.find().populate({ path: "user", select: 'name email noOfAssignedBooks' });
    let noOfBlockedUser = await blockedModel.count()
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');
    worksheet.columns = [
        { header: 'Sr. No', key: 'no', width: 28 },
        { header: 'UserId', key: 'userId', width: 28 },
        { header: 'Name', key: 'name', width: 10 },
        { header: 'Email', key: 'email', width: 20 },
        { header: 'HaveBook', key: 'noOfAssignedBooks', width: 10 }
    ];
    for (let i = 0; i < all.length; i++) {
        worksheet.addRow({ no: i + 1, userId: all[i].user._id, name: all[i].user.name, email: all[i].user.email, noOfAssignedBooks: all[i].user.noOfAssignedBooks });
    }
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });
    workbook.xlsx.writeFile('./download/BlockedUsers.xlsx')

    return {
        status: true,
        message: `Total number of Blacklisted user ${noOfBlockedUser}`,
        path: `${PATH}/BlockedUsers.xlsx`,
        data: all
    };
}

exports.userIssuedBook = async (req) => {
    const all = await issueModel.find({ user: req.user._id }).populate({ path: "book" });
    const data = _.filter(all, p => p.isBookReturned == false)
    let returnData = []
    let message = "All issued Books"
    for (let i = 0; i < data.length; i++) {
        const returnDate = fns.addDays(data[i].issueDate, 7);
        leftdays = fns.differenceInDays(returnDate, new Date())
        if(leftdays <= 2){
            message = `Warning! Only ${leftdays} days left to submit the book otherwise you will be blocked.`
        }
        let obj = {
            "bookName": data[i].book.bookName,
            "returnLeftDays": leftdays    
        }
        returnData.push(obj)
        if(req.query.bookName){
            returnData = _.filter(returnData , p => p.bookName == req.query.bookName)
        }
        if(req.query.noOfDaysLeft){
            returnData = _.filter(returnData , p => p.returnLeftDays == req.query.noOfDaysLeft)
        }
    }

    return {
        status: true,
        message: message,
        data: returnData,
    };
}

exports.fetchUserHistory = async (requestData) => {
    const all = await issueModel.find({ user: requestData._id }).populate({ path: "book", select: "bookId bookName author" });
    return {
        status: true,
        message: "all books which user has assigned till now",
        data: all,
    };
}


exports.allbooks = async (requestData) => {
    const categories = await bookModel.distinct("bookName")
    result = []
    for (let i =0 ; i < categories.length ; i++){
         let number = await bookModel.count({bookName : categories[i]})
         let available = await bookModel.count({bookName : categories[i], isAvailable : true});
        obj ={
            "Book Name" : categories[i],
            "Total Books" : number ,
            "Issued Books" : number - available, 
            "Availabe" : available,
        }
        result.push(obj)
    }
    const max  = await issueModel.aggregate([
        { $group: { _id: "$book", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ])
    const bookMax = await bookModel.findById((max[0]._id).toString())
    return {
        status: true,
        mostIssuedBook: bookMax,
        data: result,
    };
}
