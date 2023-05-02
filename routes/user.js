const router = require("express").Router();

const {
  getUsers,
  userRegister,
  getUsersById,
  loginUser,
  forgetPassword,
  forgetPasswordLink,
  updateUser,
  getManagers,
  getSalesManagers,
} = require("../controllers/user");

router.get("/getUsers", getUsers);
router.get("/getUsersById/:id", getUsersById);
router.post("/userRegister", userRegister);
router.post("/loginUser", loginUser);
router.put("/forgetPassword", forgetPassword);
router.post("/forgetPasswordLink", forgetPasswordLink);
router.put("/updateUser/:id", updateUser);
router.get("/getManagers", getManagers);
router.get("/getSalesManagers", getSalesManagers);

module.exports = router;
