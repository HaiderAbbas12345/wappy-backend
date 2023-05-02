const salesManagerModel = require("../models/SalesManger");
const UserModel = require("../models/user");

const getAllSalesManager = async (req, res) => {
  salesManagerModel
    .find()
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const getAllSalesManagerById = async (req, res) => {
  salesManagerModel
    .find({ userId: req.params.userId })
    .then((data) => {
      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};

const addNewSalesManagerById = async (req, res) => {
  const salesManagers = new salesManagerModel({
    userId: req.body.userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    timer: req.body.timer,
    userRole: "sales Manager",
  });
  try {
    const findUser = await UserModel.findOne({ _id: req.body.userId });
    if (!findUser) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    } else {
      const salesManager = await salesManagerModel.findOne({
        phoneNumber: req.body.phoneNumber,
      });
      if (salesManager) {
        res.status(409).json({
          success: false,
          message: "Sales Manager Already Exist",
        });
      } else {
        const addSalesManager = await salesManagers.save();
        if (addSalesManager) {
          res.status(200).json({
            data: addSalesManager,
            success: true,
          });
        } else {
          res.status(404).json({
            success: false,
            message: "Error Saving Sales Manager",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllSalesManager,
  getAllSalesManagerById,
  addNewSalesManagerById,
};
