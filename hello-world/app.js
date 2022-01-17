const processRequest = require("./processRequest");
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const lambdaHandler = async (event, context) => {
  console.log(JSON.stringify(event));
  const response = {
    headers: {
      "content-type": "application/json",
    },
    body: "",
    statusCode: 200,
  };
  let cep = "";
  if (!event || !event.queryStringParameters) {
    response.statusCode = 452;
  } else {
    cep = event.queryStringParameters.cep;
  }

  try {
    const address = await processRequest.processCep(cep);
    response.body = JSON.stringify(address);
  } catch (error) {
    response.statusCode = 452;
    response.body = JSON.stringify({
      error: error.message,
    });
  }

  return response;
};

exports.handler = lambdaHandler;
