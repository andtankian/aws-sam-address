const processRequest = require("../processRequest");
const cep_promise = require("cep-promise");

jest.mock("cep-promise");

describe("testing processRequest method", () => {
  const cep = "08592510";

  it("should receive an string", async () => {
    cep_promise.mockImplementation(async () => ({}));
    const spy = jest.spyOn(processRequest, "processCep");

    processRequest.processCep(cep);

    expect(spy).toBeCalled();
  });

    it("should return an object", async () => {
      cep_promise.mockImplementation(() => {
        return {};
      });

      const address = await processRequest.processCep(cep);

      expect(address).toBeInstanceOf(Object);
    });

    it("should return an object containing address keys", async () => {
      cep_promise.mockImplementation(() => {
        return {
          street: "",
          neighborhood: "",
          state: "",
          city: "",
        };
      });

      const address = await processRequest.processCep(cep);

      expect(address.logradouro).toBeDefined();
      expect(address.bairro).toBeDefined();
      expect(address.localidade).toBeDefined();
      expect(address.estado).toBeDefined();
      expect(address.cep).toBeDefined();
    });

    it("should return error cause cep is invalid", async () => {
      cep_promise.mockImplementation(async () => {
        throw Error("invalid cep");
      });
      const addressPromise = processRequest.processCep("aaaaaa");

      expect(addressPromise).rejects.toThrowError();
    });

    it("should return error cause correio is DOWN", async () => {
      cep_promise.mockImplementation(async () => {
        throw Error("correio is down");
      });
      const addressPromise = processRequest.processCep(cep);
      expect(addressPromise).rejects.toThrowError();
    });
});
