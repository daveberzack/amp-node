const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const Date = require("../common/date");
const User = require("../models/user");

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs. Please check data.", 422);
  }
  const { name, email, password } = req.body;

  const newUser = new User({
    name,
    email,
    password,
    startDate: Date.getCurrentDate(),
    cumulativeScore: 0,
    weightedScore: 0,
    level: 1,
    boosts: 0,
  });

  try {
    console.log("create:" + newUser);
    await newUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating user failed, please try again", 500);
    return next(error);
  }
  res.json({ success: "true" });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userid;
  let userObject = {};
  try {
    const user = await User.findById(userId);
    userObject = user.toObject({ getters: true });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not find a user for this id", 404);
    return next(error);
  }
  res.json({ user: userObject });
};

const getAllUsers = async (req, res, next) => {
  let userObjects = [];
  try {
    const users = await User.find();
    userObjects = users.map((c) => c.toObject({ getters: true }));
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not find users", 404);
    return next(error);
  }
  res.json({ users: userObjects });
};

const _getUserById = async (userId) => {
  let userObject = {};
  try {
    const user = await User.findById(userId);
    console.log("?" + userId + ":" + user);
    userObject = user.toObject({ getters: true });
  } catch (err) {
    console.log(err);
  }
  return userObject;
};

const _canUserUpdate = (user) => {
  return user.level >= 2;
};

const _canUserApprove = (user) => {
  return user.level >= 3;
};

const _canUserSelfApprove = (user) => {
  return user.level >= 5;
};

exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports._getUserById = _getUserById;
exports._getUserByIdHelper = _getUserById;
exports._canUserUpdate = _canUserUpdate;
exports._canUserApprove = _canUserApprove;
exports._canUserSelfApprove = _canUserSelfApprove;
// exports.updateUser = updateUser;
