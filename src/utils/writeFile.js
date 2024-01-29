const fs = require('fs').promises;

const writeFile = async (path, data) => {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
    return;
  } catch (error) {
    throw new TypeError(`O Arquivo não pode ser escrito. ${error}`);
  }
};

module.exports = {
  writeFile,
};