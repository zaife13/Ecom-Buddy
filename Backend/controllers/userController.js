const HttpError = require('../utils/httpError');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const QueryHandler = require('../utils/QueryHandler');
const { createUserWithToken } = require('../utils/createUserWithToken');

const updatableObjects = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((keyElement) => {
    if (allowedFields.includes(keyElement)) {
      newObj[keyElement] = obj[keyElement];
    }
  });
  return newObj;
};

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createUserWithToken(newUser, 201, res);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // -- BUILD QUERY --//

  const docs = new QueryHandler(
    User.find({ role: { $ne: 'admin' } })
      .select('+active')
      .bypassInactives(),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await docs.query;

  // User.find() will populate the user with the help of pre find middleware

  // localhost:8000/users?fields=name,desciption&sort=price
  // {fields: name,description}
  /*
       get the features obj from APIFeaturs class that takes the FIND query and our query string and apply different functions to the query.
      */

  // -- EXECUTE QUERY --//
  //const docs = await features.query;

  // -- SEND RESPONSE --//

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users.map((user) => user.toObject({ getters: true })),
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('+password +active').bypassInactives();

  if (!user) {
    return next(new HttpError('Could not find an account for the provided id!', 404));
  }

  res.status(200).send({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('+password +active').bypassInactives();
  // bypassInactives is a custom mongoose query method that will bypass the middleware and will not filter out the inactive users. So that we can update the inactive user to active again.

  if (!user) {
    return next(new HttpError('No User with that id found', 404));
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.active = req.body.active || user.active;
  user.password = req.body.password || user.password;
  user.passwordConfirm = req.body.passwordConfirm || user.password;

  await user.save();

  res.status(200).send({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new HttpError('No User with that id found', 404));
  }

  res.status(204).send({
    status: 'success',
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new HttpError('This route does not support updating password!', 400));
  }

  const filteredObjects = updatableObjects(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObjects, {
    new: true,
    runValidators: true,
  });

  res.status(200).send({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  res.status(204).send({
    status: 'success',
    data: null,
  });
});
exports.getMyAccount = (req, res, next) => {
  // just set the req.params.id to the userId of the currently logged in object that will send the user object as a part of request using the protect middleware in the authController.
  req.params.id = req.user.id;
  next();
};
