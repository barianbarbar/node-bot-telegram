const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");

router.get("/", appController.getAllData);
router.get("/excel", appController.convertDataToExcel);
router.get("/edit/:idData", appController.pageEditData);
router.post("/edit/:idData", appController.editDataById);
router.get("/delete/:idData", appController.deleteDataById);

module.exports = router;
