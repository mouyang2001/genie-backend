const mongoClient = require("../models/mongoConnection");

const getClients = async (req, res, next) => {
  const clientCollection = mongoClient.db("teamregex").collection("clients");
  const clients = await clientCollection
    .find({ archived: { $in: [false, null] } })
    .toArray();

  res.json(clients);
};

const getCurrentClients = async (req, res, next) => {
  const conversationCollection = mongoClient
    .db("teamregex")
    .collection("conversations");
  const status = await conversationCollection.find({}).toArray();

  res.json(status);
};

module.exports = {
  getClients,
  getCurrentClients,
};
