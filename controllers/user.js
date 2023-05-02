const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const getUsers = async (req, res) => {
  userModel
    .find()
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getManagers = async (req, res) => {
  userModel
    .find({ userRole: "manager" })
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getSalesManagers = async (req, res) => {
  userModel
    .find({ userRole: "sales manager" })
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getUsersById = async (req, res) => {
  userModel
    .findById(req.params.id)
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const userRegister = async (req, res) => {
  console.log(req.body);
  const salt = bcrypt.genSaltSync(10);
  let user = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: bcrypt.hashSync(req.body.password, salt),
    userRole: "user",
  });
  try {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      res.status(400).json({
        data: userExists,
        message: "User already exist",
      });
    } else {
      user
        .save()
        .then((data) => {
          return res.status(200).send({
            success: true,
            message: "User registered successfully",
            data: data,
          });
        })
        .catch((err) => {
          return res.status(404).send({
            success: false,
            message:
              err.message || "Some error occurred while sending a message.",
          });
        });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Service unavailable",
    });
  }
};

const forgetPasswordLink = async (req, res) => {
  try {
    userModel.findOne({ email: req.body.email }, (err, data) => {
      if (data) {
        //   try {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "hmughal0123@gmail.com",
            pass: "jaieiiujsvzoerqw",
          },
        });

        let email = data.email;

        var mailOptions = {
          from: "hmughal0123@gmail.com",
          to: `${req.body.email}`,
          subject: "Password reset",
          html:
            "<h3>Hello!</h3>" +
            "<p>You are receiving this email because we received a password reset request for your account.</p>" +
            `<a href="http://localhost:3000/forget/${email}"  style="background-color:black; margin-top:10px;
              margin-bottom:10px margin-left:30px; color:white; padding:6px; border-radius: 2px;"  >
              Reset password</a>` +
            "<p>If you did not request a password reset, no further action is required.</p>" +
            "<p>Regards,</p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return res.status(400).json({ message: "Email not Sent" });
          } else {
            return res.status(200).json({ message: "Email Sent" });
          }
        });
      } else {
        return res.status(400).json({ message: "Email not exist" });
      }
    });
  } catch (err) {
    return res.status(404).json({ message: "Network Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const data = await userModel.findOne({ email: req.body.email });
    if (data) {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res
          .status(200)
          .json({ success: true, data, message: "Login Successful" });
      } else {
        res.status(401).json({ message: "Password Invalid" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Service unavailable",
    });
  }
};

const updateUser = async (req, res) => {
  userModel
    .findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          success: false,
          message: "user not found with id " + req.params.id,
        });
      } else {
        res.status(200).send({
          success: true,
          data: data,
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        message: "Sevice unavailable" + req.params.id + err,
      });
    });
};

const forgetPassword = async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  try {
    userModel.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: bcrypt.hashSync(req.body.password, salt) } },
      { new: true },
      (err, data) => {
        if (data) {
          return res
            .status(200)
            .json({ message: "Password updated successfully" });
        } else {
          return res.status(400).json({ message: "Email not found" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: "Network error" });
  }
};

module.exports = {
  getUsers,
  getUsersById,
  userRegister,
  loginUser,
  forgetPassword,
  forgetPasswordLink,
  updateUser,
  getManagers,
  getSalesManagers,
};
