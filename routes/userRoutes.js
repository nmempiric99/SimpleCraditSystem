const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register",userController.registerUser);
router.put("/createFreeAPI",userController.createFreeAPI);
router.get("/viewKeyInfo/:_id",userController.apiKeyInfo);
router.put("/purchaseCredit/:_id",userController.purchaseCredit);
router.post("/useLimit/:_id",userController.useLimit);

module.exports = router;
