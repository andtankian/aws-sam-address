const cep_promise = require("cep-promise");
const { getAddress, addAddress } = require("./repository");

const processCep = async (cep) => {
  let address = {};
  try {
    address = await getAddress(cep);
    if (address.cep) {
      return address;
    }
    const result = await cep_promise(cep);
    address.logradouro = result.street;
    address.bairro = result.neighborhood;
    address.localidade = result.city;
    address.estado = result.state;
    address.cep = cep;

    await addAddress(address);
  } catch (error) {
    console.log(JSON.stringify(error))
    throw Error(`error retrieving cep`);
  }
  return address;
};

exports.processCep = processCep;
