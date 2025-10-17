// paymentApi/routes.js
const express = require("express");
const router = express.Router();
const paymentController = require("./controller");

// ✅ Routes
router.post("/", paymentController.createPayment);
router.get("/", paymentController.getPayments);  // 👈 make sure this matches export name
router.get("/:id", paymentController.getPaymentById);
router.put("/:id", paymentController.updatePayment);
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
