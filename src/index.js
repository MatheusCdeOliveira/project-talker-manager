const express = require('express');
const path = require('path');
const { readFile } = require('./readFile');
const token = require('./utils/generateToken');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const pathName = path.resolve(__dirname, './talker.json');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
 
app.get('/talker', async (_req, res) => {
   const talker = await readFile(pathName);
   res.status(HTTP_OK_STATUS).json(talker);
});

app.get('/talker/:id', async (req, res) => {
    const { id } = req.params;
    const talker = await readFile(pathName);
    const filteredTalker = talker.find((element) => element.id === Number(id));
    if (!filteredTalker) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    res.status(HTTP_OK_STATUS).json(filteredTalker);
});

app.post('/login', async (_req, res) => {
    const newToken = token();
    res.status(HTTP_OK_STATUS).json({ token: newToken });
});

app.listen(PORT, () => {
  console.log('Online');
});
