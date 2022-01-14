const app = require("../app");

const { processCep } = require("../processRequest");

jest.mock("../processRequest");

processCep.mockResolvedValue({});

describe("testing app js", () => {
  const event = {
    queryStringParameters: { cep: "08576275" },
  };

  it("should return an object containing a statusCode property", async () => {
    expect(await app.handler(event)).toMatchObject({
      statusCode: 200,
    });
  });

  it("should return an object containing the body property", async () => {
    const response = await app.handler();

    // {
    //     body: "something"
    // }

    expect(response.body).toBeDefined();
  });

  it("should receive an event containing queryStringParameters", async () => {
    const spy = jest.spyOn(app, "handler");

    await app.handler(event);

    expect(spy).toHaveBeenCalledWith(event);
  });

  it("should return statusCode 452 because event doesnt have queryStringParameters", async () => {
    const result = await app.handler();

    expect(result.statusCode).toBe(452);
  });

  it("should return the address", async () => {
    processCep.mockResolvedValue({ localidade: "Itaquaquecetuba" });
    const result = await app.handler(event);

    expect(result.body).toBeDefined();
    expect(typeof result.body).toBe("string");

    const address = JSON.parse(result.body);

    expect(address.localidade).toBe("Itaquaquecetuba");
  });

  it("should explode an error because service is down and return statusCode 452", async () => {
    processCep.mockRejectedValue({ message: "Serviço dos correios caiu" });

    const result = await app.handler(event);

    expect(result.statusCode).toBe(452);
    expect(result.body).toBeDefined();
    expect(typeof result.body).toBe("string");

    const body = JSON.parse(result.body);

    expect(body.error).toBe("Serviço dos correios caiu");
  });
});
