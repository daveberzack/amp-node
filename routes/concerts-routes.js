const Express = require("express");
const { check } = require("express-validator");
const ConcertsControllers = require("../controllers/concerts-controller");

const router = Express.Router();

router.get("/all", ConcertsControllers.getAllConcerts);

router.get("/city/:cityid", ConcertsControllers.getConcertsByCityId);

//router.get("/user/:userid", ConcertsControllers.getConcertsByUserId);

router.post(
  "/:token",
  [
    check("date").not().isEmpty(),
    check("venue").not().isEmpty(),
    check("headliners").not().isEmpty(),
  ],
  ConcertsControllers.createConcert
);

router.patch("/:token", ConcertsControllers.updateConcert);

router.patch("/boost/:concertid/:token", ConcertsControllers.boostConcert);

router.patch(
  "/approve/:concertid/:isapproved/:token",
  ConcertsControllers.approveChanges
);

module.exports = router;
