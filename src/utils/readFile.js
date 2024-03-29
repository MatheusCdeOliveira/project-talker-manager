const fs = require('fs').promises;

const readFile = async (path) => {
  try {
    const data = await fs.readFile(path);
    return JSON.parse(data);
  } catch (error) {
    throw new TypeError(`O Arquivo não pode ser lido. ${error}`);
  }
};

module.exports = {
  readFile,
};