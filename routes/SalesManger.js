const router = require("express").Router();

const {
  addNewSalesManagerById,
  getAllSalesManager,
  getAllSalesManagerById,
} = require("../controllers/SalesManger");

router.get("/getAllSalesManager", getAllSalesManager);
router.get("/getAllSalesManagerById/:userId", getAllSalesManagerById);
router.post("/addNewSalesManagerById", addNewSalesManagerById);

module.exports = router;
