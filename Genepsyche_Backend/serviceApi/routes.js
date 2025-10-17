// Genepsyche_Backend/serviceApi/routes.js
const express = require("express");
const router = express.Router();
const Service = require("./model"); // Sequelize model

// ✅ GET all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.findAll({
      attributes: ["id", "name", "createdAt", "updatedAt"],
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("❌ Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
});

// ✅ POST create a new service
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Service name is required",
      });
    }

    const newService = await Service.create({ name });
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("❌ Error creating service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
});

// ✅ PUT update a service
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.name = name || service.name;
    await service.save();

    res.json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("❌ Error updating service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
});

// ✅ DELETE service
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.destroy();
    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
});

module.exports = router;
