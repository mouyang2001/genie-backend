const mongoClient = require("../models/mongoConnection");
const mongo = require("mongodb");
const { getAllTerms } = require("../models/awsComprehendModel");

const addMockData = async (req, res, next) => {
  let data = [
    {
      name: "Jackson Street",
      desc: "Commercial photographer for art exhibit",
      date: "2020-11-12T08:31:02.07Z",
      location: "Auckland Art Gallery, Auckland, New Zealand",
      terms: "1 photographer, 10 hours",
      budgetEstimate: [0, 1000],
      status: "pending",
      email: "jackson@aag.org.nz",
      service_type: "Photography",
      staff_count: "1",
      service_time: "5",
      create_date: "2020-09-23T08:31:02.07Z",
      archived: null,
      status: "pending",
    },
    {
      name: "Jennifer Akai",
      desc: "Music Video",
      date: "2021-05-12T08:31:02.07Z",
      location: "Wellington, New Zealand",
      terms: "1 videographer, 10 hours",
      budgetEstimate: [0, 1000],
      status: "pending",
      email: "jennifer12@gmail.com",
      service_type: "Videography",
      staff_count: "1",
      service_time: "20",
      create_date: "2020-07-02T08:31:02.07Z",
      archived: null,
      status: "pending",
    },
    {
      name: "Tony Stark",
      desc: "Billboard photo",
      date: "2020-12-12T08:31:02.07Z",
      location: "New York, U.S.A",
      terms: "20 photographers, 2 hours",
      budgetEstimate: [0, 1000],
      status: "pending",
      email: "tony@marvel.com",
      service_type: "Photography",
      staff_count: "20",
      service_time: "2",
      create_date: "2020-07-01T08:31:02.07Z",
      archived: null,
      status: "pending",
    },
    {
      name: "Elon Musk",
      desc: "Car advert",
      date: "2020-10-10T08:31:02.07Z",
      location: "California, U.S.A",
      terms: "1 videographer, 48 hours",
      budgetEstimate: [0, 1000],
      status: "pending",
      email: "elonmusk@tesla.com",
      service_type: "Videography",
      staff_count: "1",
      service_time: "48",
      create_date: "2020-09-22T08:31:02.07Z",
      archived: null,
      status: "pending",
    },
  ];

  for (let i = 0; i < 4; i++) {
    data[i].quoted = Math.round(Math.random() * 450) * 10 + 500;
  }

  const clientsCollection = mongoClient.db("teamregex").collection("clients");

  clientsCollection.insertMany(data);

  res.json({ statusCode: "Successfully added records" });
};

const deleteAllData = async (req, res, next) => {
  const clientsCollection = mongoClient.db("teamregex").collection("clients");

  clientsCollection.deleteMany({});

  res.json({ statusCode: "Successfully made utility function call!" });
};

const resetData = async (req, res, next) => {
  const clientsCollection = mongoClient.db("teamregex").collection("clients");

  const response = {
    archived: null,
    status: "pending",
  };

  clientsCollection.updateMany({}, { $set: response });

  res.json({ statusCode: "Successfully made utility function call!" });
};

const updateStatus = async (req, res) => {
  const clientsCollection = mongoClient.db("teamregex").collection("clients");

  const response = {};

  if (req.body.status !== null) {
    response.status = req.body.status;
  }

  if (req.body.archived !== null) {
    response.archived = req.body.archived;
  }

  await clientsCollection.updateOne(
    { _id: mongo.ObjectId(req.body.object_id) },
    { $set: response }
  );

  res.json({ statusCode: "Successfully updated records" });
};

module.exports = {
  resetData,
  deleteAllData,
  addMockData,
  updateStatus,
};
