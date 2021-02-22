const AWS = require("aws-sdk");
const comprehend = new AWS.Comprehend();

const getAllTerms = async (text) => {
  const entities = await getEntities(text);
  const keywords = await getKeywords(text);

  let keywordsLimited = keywords.filter((word, index, self) => {
    let contains = true;
    entities.forEach((entity) => {
      if (entity.content.toLowerCase().includes(word.toLowerCase())) {
        contains = false;
      } else if (word.toLowerCase().includes(entity.type.toLowerCase())) {
        contains = false;
      }
    });

    return contains;
  });

  return { entities: entities, keywords: keywordsLimited };
};

const getEntities = async (text) => {
  let params = {
    LanguageCode: "en",
    Text: text,
  };

  try {
    const largeEntities = await comprehend.detectEntities(params).promise();
    const piiEntities = await comprehend.detectPiiEntities(params).promise();

    const largeEntitiesArr = largeEntities.Entities.map((entity) => {
      return {
        type: entity.Type,
        content: text.substring(entity.BeginOffset, entity.EndOffset),
      };
    });

    const piiEntitiesArr = piiEntities.Entities.map((entity) => {
      return {
        type: entity.Type,
        content: text.substring(entity.BeginOffset, entity.EndOffset),
      };
    });

    let entityArray = [...piiEntitiesArr, ...largeEntitiesArr];

    let response = entityArray.filter(
      (entity, index, self) =>
        index ===
        self.findIndex((t) =>
          t.content.toLowerCase().includes(entity.content.toLowerCase())
        )
    );

    return response;
  } catch (err) {
    console.log("SERVER_ERROR: ", err, err.stack);

    return { error: "AWS Comprehend Error" };
  }
};

const getKeywords = async (text) => {
  let params = {
    LanguageCode: "en",
    Text: text,
  };

  try {
    const result = await comprehend.detectKeyPhrases(params).promise();
    return result.KeyPhrases.map((phraseObj) => phraseObj.Text);
  } catch (err) {
    console.log("SERVER_ERROR: ", err, err.stack);

    return { error: "AWS Comprehend Error" };
  }
};

module.exports = {
  getKeywords,
  getEntities,
  getAllTerms,
};
