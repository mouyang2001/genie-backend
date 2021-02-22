const mongoClient = require("../models/mongoConnection");
const mongo = require("mongodb");

const getSettings = async (req, res, next) => {
  const settingsCol = mongoClient.db("teamregex").collection("settings");

  const settingsArray = await settingsCol.find({}).toArray();

  res.json(settingsArray[0]);
};

const setSettings = async (req, res, next) => {
  const settingsCol = mongoClient.db("teamregex").collection("settings");

  const response = {
    business_name: req.body.business_name,
    business_category: req.body.business_category,
    quote_spectrum: req.body.quote_spectrum,
    quote_precision: req.body.quote_precision,
    auto_estimate: req.body.auto_estimate,
  };

  await settingsCol.updateOne(
    { _id: mongo.ObjectId(req.body.object_id) },
    { $set: response }
  );
};

module.exports = {
  getSettings,
  setSettings,
};
