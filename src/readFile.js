const fs = require('fs').promises;

const readFile = async (path) => {
  try {
   const data = await fs.readFile(path);
   return JSON.parse(data);
  } catch (err) {
    console.error(`O arquivo não pôde ser lido. ${err}`);
  }
};

module.exports = {
  readFile,
};