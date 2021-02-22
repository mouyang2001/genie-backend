const { Router } = require("express");

const inputController = require("../controllers/InputController");

const router = Router();

router.post("/instabot", inputController.saveChatbotInput);

router.post("/form-aibot", inputController.saveFormAiInput);

module.exports = router;
