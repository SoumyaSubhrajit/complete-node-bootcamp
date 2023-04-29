
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel')
const AppError = require('../utils/appError');

// FILTERING THE REQUEST DATA TO UPDATE..
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  })
  return newObj;
}


// ADDING THE updateMe ROUTE, USER CAN SAVE DATA EXCLUDE- PASSWORD AND ROLE.
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error is the user try to change the password or update the password..
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for the password updates, Please use the /updateMyPassword route!'))
  }

  // 2) Take/filter the data that present inside the body in request..
  const filterBody = filterObj(req.body, 'email', 'name')

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  })
  res.status(200).json({
    status: 'Success',
    data: {
      user: updateUser
    }
  })
})


// ADDING THE DELETE USER FUNCTIONALITY..
exports.deleteMe = catchAsync(async (req, res, next) => {
  // Finding user with id..
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(201).json({
    status: 'Success',
    data: null
  })
})



exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users
    }
  })
})


exports.getUsers = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'The route is not defined yet!!'
  })
}

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'The route is not defined yet!!'
  })
}

exports.updateUsers = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'The route is not defined yet!!'
  })
}

exports.deleteUsers = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'The route is not defined yet!!'
  })
}