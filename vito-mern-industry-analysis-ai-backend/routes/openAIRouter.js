const express = require("express");
const isAuthenticated = require("../Middlewares/isAuthenticated");
const { openAIController } = require("../controllers/openAIController");
const checkApiRequestLimit = require("../Middlewares/checkApiRequestLimit");

const openAIRouter = express.Router();

openAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  openAIController
);

module.exports = openAIRouter;
