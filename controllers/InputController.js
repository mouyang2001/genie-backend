const mongoClient = require("../models/mongoConnection");
const mongo = require("mongodb");
const { getAllTerms } = require("../models/awsComprehendModel");

const calculateQuote = (type, count, time) => {
  if (type && count && time) {
    // only two options photography and videography
    if (type.toUpperCase() == "PHOTOGRAPHY") {
      return 200 * time + 40 * count * time + 500;
    } else {
      return 200 * time + 50 * count * time + 800;
    }
  } else {
    return 420;
  }
};

// returns a range as array
const calculateRange = (type, count, time) => {
  if (type && count && time) {
    if (type.toUpperCase == "PHOTOGRAPHY") {
      return [200 * time, 200 * time + 40 * count * time + 750];
    } else {
      return [200 * time, 200 * time + 40 * count * time + 900];
    }
  } else {
    return [0, 1000];
  }
};

const saveChatbotInput = async (req, res, next) => {
  const clientCollection = mongoClient.db("teamregex").collection("clients");

  let quoted = 420,
    budgetEstimate = [0, 1000];

  const clientInput = {
    name: req.body.firstName + " " + req.body.lastName,
    desc: req.body.customProperties.service_description.slice(2, -2),
    date: req.body.customProperties.service_date.slice(3, -3),
    location: req.body.customProperties.service_location.slice(2, -2),
    terms: "",

    budgetEstimate: budgetEstimate,
    quoted: quoted,

    status: "pending",
    email: req.body.email,
    service_type: req.body.customProperties.service_type.slice(2, -2),
    staff_count: req.body.customProperties.staff_count.slice(2, -2),
    service_time: req.body.customProperties.service_time.slice(2, -2),
    create_date: req.body.createDate,
  };

  // apply quotedCalculator functions
  clientInput.quoted = calculateQuote(
    clientInput.service_type,
    parseInt(clientInput.staff_count),
    parseInt(clientInput.service_time)
  );

  clientInput.budgetEstimate = calculateRange(
    clientInput.service_type,
    parseInt(clientInput.staff_count),
    parseInt(clientInput.service_time)
  );

  console.log(clientInput);

  console.log(req.body.customProperties);

  clientCollection.insertOne(clientInput);

  res.json({ statusDescription: "Data uploaded to db successfully!" });
};

const saveFormAiInput = async (req, res, next) => {
  const clientCollection = mongoClient.db("teamregex").collection("clients");

  //Data filtering
  if (req.body.text) {
    const allTerms = await getAllTerms(req.body.text);
    res.json(allTerms);

    let name = "",
      desc = "",
      date = "",
      location = "",
      terms = "",
      email = "",
      serviceType = "",
      staffCount = "",
      serviceTime = "",
      createDate = "",
      quoted = 420,
      budgetEstimate = [0, 1000];

    createDate = new Date(Date.now()).toISOString();

    for (let i = 0; i < allTerms.entities.length; i++) {
      let ent = allTerms.entities[i];
      if (ent.type == "NAME") {
        name = ent.content;
      } else if (ent.type == "DATE_TIME") {
        date = ent.content;
      } else if (ent.type == "ADDRESS") {
        location = ent.content;
      } else if (ent.type == "EMAIL") {
        email = ent.content;
      } else if (ent.type == "QUANTITY") {
        terms += ent.content + ", ";

        //extract quantities
        if (ent.content.includes("videographer")) {
          staffCount = ent.content.replace(/[^0-9]/g, "");
          serviceType = "Videography";
        } else if (ent.content.includes("photographer")) {
          staffCount = ent.content.replace(/[^0-9]/g, "");
          serviceType = "Photography";
        } else if (ent.content.includes("hours")) {
          serviceTime = ent.content.replace(/[^0-9]/g, "");
        }
      }
    }

    for (let i = 0; i < allTerms.keywords.length; i++) {
      desc += allTerms.keywords[i] + ", ";
    }

    //apply quote calculation function
    quoted = quoteCalculator.calculateQuote(
      serviceType,
      parseInt(staffCount),
      parseInt(serviceTime)
    );

    budgetEstimate = quoteCalculator.calculateRange(
      serviceType,
      parseInt(staffCount),
      parseInt(serviceTime)
    );

    //upload data object
    const uploadData = {
      name: name,
      desc: desc,
      date: new Date(date).toISOString(),
      location: location,
      terms: terms,

      //todo: apply quote calculator
      budgetEstimate: budgetEstimate,
      quoted: quoted,

      status: "pending",
      email: email,

      service_type: serviceType,
      staff_count: staffCount,
      service_time: serviceTime,

      create_date: createDate,
    };

    clientCollection.insertOne(uploadData);

    return 0;
  }

  res.json({ statusCode: "No text sent!" });
};

module.exports = {
  saveChatbotInput,
  saveFormAiInput,
};
