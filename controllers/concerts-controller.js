const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const UsersController = require("../controllers/users-controller");
const Date = require("../common/date");
const Concert = require("../models/concert");
const User = require("../models/user");

const createConcert = async (req, res, next) => {
  const userId = req.params.token;
  const now = Date.getCurrentDate();
  const user = UsersController._getUserById(userId);
  const approvalStatus = user.canSelfApprove ? "APPROVED" : "CREATED";

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs. Please check data.", 422);
  }
  const {
    cityId,
    date,
    time,
    venue,
    price,
    detailUrl,
    ticketUrl,
    headliners,
    openers,
  } = req.body;

  const newConcert = new Concert({
    history: [
      {
        status: "CREATED",
        cityId,
        date,
        time,
        venue,
        price,
        detailUrl,
        ticketUrl,
        headliners,
        openers,
        creator: userId,
        created: now,
        approvalStatus: approvalStatus,
      },
    ],
  });
  try {
    await newConcert.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating concert failed, please try again",
      500
    );
    return next(error);
  }
  res.json({ success: "true" });
};

const updateConcert = async (req, res, next) => {
  const newValues = req.body;
  const concertId = req.body._id;
  const userId = req.params.token;
  const now = Date.getCurrentDate();
  const user = await UsersController._getUserById(userId);
  const approvalStatus = UsersController._canUserSelfApprove(user)
    ? "APPROVED"
    : "CREATED";
  delete newValues.id;

  if (!UsersController._canUserUpdate(user)) {
    throw new HttpError("User does not have update access.", 422);
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs. Please check data.", 422);
  }

  try {
    Concert.findById(concertId).then(function (existingConcert) {
      const historyValues = {
        ...newValues,
        creator: userId,
        created: now,
        approvalStatus: approvalStatus,
      };
      console.log(">>> existingConcert:" + concertId);
      console.log(existingConcert);
      existingConcert.history.push(historyValues);
      existingConcert.save();
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not find a concert for this id", 404);
    return next(error);
  }

  res.json({ success: "true" });
};

const boostConcert = async (req, res, next) => {
  let success = true;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs. Please check data.", 422);
    success = false;
    return next(error);
  }

  const concertId = req.params.concertid;
  const userId = req.params.token;
  const now = Date.getCurrentDate();

  const user = await UsersController._getUserById(userId);
  console.log("boost by user:" + user);
  if (!user.boosts || user.boosts < 1) {
    throw new HttpError("No boosts left.", 422);
    success = false;
    return next(error);
  }

  try {
    Concert.findById(concertId).then(function (existingConcert) {
      var alreadyBoosted = false;
      existingConcert.boosts.forEach((item) => {
        if (item.creatorId == userId) {
          alreadyBoosted = true;
        }
      });

      if (alreadyBoosted) {
        throw new HttpError("Already boosted this concert.", 422);
        success = false;
        return next(error);
      } else {
        existingConcert.boosts.push({
          creatorName: user.name,
          creatorId: userId,
          created: now,
        });
        existingConcert.save();

        User.findById(userId).then(function (user) {
          user.boosts--;
          user.save();
        });
      }
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not boost this concert", 404);
    success = false;
    return next(error);
  }

  res.json({ success });
};

const approveChanges = async (req, res, next) => {
  const concertId = req.params.concertid;
  const userId = req.params.token;
  const now = Date.getCurrentDate();
  const user = await UsersController._getUserById(userId);
  const isApproved = req.params.isapproved;

  if (!UsersController._canUserApprove(user)) {
    throw new HttpError("User does not have approve access.", 422);
  }

  try {
    Concert.findById(concertId).then(function (existingConcert) {
      existingConcert.history.forEach((item) => {
        console.log(">>>>" + item);
        item.approvalStatus = isApproved ? "APPROVED" : "DENIED";
      });

      console.log(">>> approvedConcert:" + concertId);
      console.log(existingConcert);

      existingConcert.save();
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not find a concert for this id", 404);
    return next(error);
  }

  res.json({ success: "true" });
};

const getAllConcerts = async (req, res, next) => {
  let concertObjects = [];
  try {
    const concerts = await Concert.find();
    concertObjects = concerts.map((c) => c.toObject({ getters: true }));
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not find concerts", 404);
    return next(error);
  }
  res.json({ concerts: concertObjects });
};

const getConcertById = async (req, res, next) => {
  const concertId = req.params.concertid;
  let concertObject = {};
  try {
    const concert = await Concert.findById(concertId);
    concertObject = concert.toObject({ getters: true });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not find a concert for this id", 404);
    return next(error);
  }
  res.json({ concert: concertObject });
};

const getConcertsByUserId = async (req, res, next) => {
  const userId = req.params.userid;
  let concertObjects = [];
  try {
    const concerts = await Concert.find({ "venue.id": userId });
    concertObjects = concerts.map((c) => c.toObject({ getters: true }));
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not find concerts", 404);
    return next(error);
  }
  res.json({ concerts: concertObjects });
};

const getConcertsByCityId = async (req, res, next) => {
  const cityId = req.params.cityid;
  let concertObjects = [];
  try {
    const concerts = await Concert.find({ "history.cityId": cityId });
    concertObjects = concerts.map((c) => c.toObject({ getters: true }));
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not find concerts", 404);
    return next(error);
  }
  res.json({ concerts: concertObjects });
};

exports.getConcertById = getConcertById;
exports.getAllConcerts = getAllConcerts;
exports.getConcertsByCityId = getConcertsByCityId;
exports.createConcert = createConcert;
exports.updateConcert = updateConcert;
exports.boostConcert = boostConcert;
exports.approveChanges = approveChanges;
