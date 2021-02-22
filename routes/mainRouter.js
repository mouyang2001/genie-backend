const { Router } = require("express");

const clientController = require("../controllers/ClientController");
const utilityController = require("../controllers/UtilityController");
const settingsController = require("../controllers/SettingsController");

const router = Router();

const inputRouter = require("./inputRouter");
router.post("/api/approval", utilityController.updateStatus);

router.get("/api/settings", settingsController.getSettings);

router.post("/api/settings", settingsController.setSettings);

router.get("/api/util/add", utilityController.addMockData);
router.get("/api/util/delete", utilityController.deleteAllData);
router.get("/api/util/reset", utilityController.resetData);

router.get("/api/clients", clientController.getClients);

router.get("/api/clients/current", clientController.getCurrentClients);

router.use("/api/inputs", inputRouter);

router.use("/", (req, res, next) => {
  res.send(`
    <h2>Genie Express API</h2>
    <p>
      You have reached the express API for Genie.
      Refer to <a href='https://github.com/Ray-F/Genie'>GitHub repository</a> for access
    </p>
  `);
});

module.exports = router;
