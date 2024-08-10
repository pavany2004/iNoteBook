const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var fetchuser = require("../middleware/fetchuser");
var jwt = require("jsonwebtoken");

const JSW_SECRET = "pavankumarisagood$boy";

// Route 1 :: create a user using : POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false;
    // if there are the errors return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    // check whether user with same email exist already

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({success, error: "Sorry a user with this email already " });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JSW_SECRET);

      // res.json(user)
      success=true;
      res.json({success,authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal sever error occured");
    }
  }
);

//Route 2 :: authenticate a user using : POST "/api/auth/login". No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    // if there are the errors return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {

        return res
          .status(400)
          .json({ error: "Please try to login using the correct credencials" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        success=false
        return res.status(400).json({success, error: "Please try to login using the correct credencials" });
      }

      const data = {
        user: {
          id: user.id,
        }
      };
      const authToken = jwt.sign(data, JSW_SECRET);
      success=true;
      res.json({ success,authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal sever error occured");
    }
  }
);

// Route 3 ::  Get a  user detail  using : POST "/api/auth/getuser".  login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal sever error occured");
  }
});
module.exports = router;
