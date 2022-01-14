const cep_promise = require("cep-promise");

const processCep = async (cep) => {
  const address = {};
  try {
    const result = await cep_promise(cep);
    address.logradouro = result.street;
    address.bairro = result.neighborhood;
    address.localidade = result.city;
    address.estado = result.state;
    address.cep = cep;
  } catch (error) {
    throw Error(`error retrieving cep`);
  }
  return address;
};

exports.processCep = processCep;
