const AWS = require("aws-sdk");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const Dynamo = new AWS.DynamoDB();

const TableName = process.env.AddressTable;

const getAddress = async (cep) => {
  console.log("getAddress", cep);
  const { Items } = await Dynamo.query({
    TableName,
    ExpressionAttributeNames: {
      "#cep": "cep",
    },
    ExpressionAttributeValues: {
      ":cep": {
        S: cep,
      },
    },
    KeyConditionExpression: "#cep = :cep",
  }).promise();

  if (Items && Items.length > 0) {
    return unmarshall(Items[0]);
  }
  return {};
};

exports.getAddress = getAddress;

const addAddress = async (address) => {
  if (!address.cep) {
    throw Error("Endereço sem cep");
  }
  const addressToBeAdd = marshall(address);
  await Dynamo.putItem({
    TableName,
    Item: addressToBeAdd,
  }).promise();
};

exports.addAddress = addAddress;
