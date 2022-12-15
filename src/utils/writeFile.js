const fs = require('fs').promises;

const writeFile = async (path, data) => {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
   return true;
  } catch (err) {
    console.error(`O arquivo não pôde ser escrito. ${err}`);
    return false;
  }
};

module.exports = {
  writeFile,
};