const Express = require("express");
const { check } = require("express-validator");
const UsersController = require("../controllers/users-controller");

const router = Express.Router();

router.get("/all", UsersController.getAllUsers);

router.get("/id/:userid", UsersController.getUserById);

router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("email").not().isEmpty(),
    check("password").not().isEmpty(),
  ],
  UsersController.createUser
);

// router.patch("/:userid/:token", UsersController.updateUser);

module.exports = router;
