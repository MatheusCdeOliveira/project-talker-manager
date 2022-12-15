const express = require('express');
const path = require('path');
const { authentication } = require('./middlewares/auth');
const { readFile } = require('./readFile');
const { writeFile } = require('./utils/writeFile');
const token = require('./utils/generateToken');
const { validationAge } = require('./validations/validationAge');
const { validationEmail } = require('./validations/validationEmail');
const { validationName } = require('./validations/validationName');
const { validationPassword } = require('./validations/validationPassword');
const { validationRate } = require('./validations/validationRate');
const { validationTalk } = require('./validations/validationTalk');
const { validationWatchedAt } = require('./validations/validationWatchedAt');

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

app.post('/login', validationEmail, validationPassword, (_req, res) => {
    const newToken = token();
    res.status(HTTP_OK_STATUS).json({ token: newToken });
});

app.post('/talker',
 authentication,
  validationName,
  validationAge,
  validationTalk,
  validationWatchedAt,
  validationRate,
   async (req, res) => {
    try {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkers = await readFile(pathName);
    const updatingID = talkers[talkers.length - 1].id + 1;
    const newTalker = {
      id: updatingID, name, age, talk: { watchedAt, rate },
    };
    const updatedTalkers = [...talkers, newTalker];
    await writeFile(pathName, updatedTalkers);
    res.status(201).json(newTalker);
  } catch (__error) {
    console.error(__error);
  }
});

app.put('/talker/:id',
  authentication,
  validationName,
  validationAge,
  validationTalk,
  validationWatchedAt,
  validationRate, async (req, res) => {
 try {
   const { id } = req.params;
   const { name, age, talk: { watchedAt, rate } } = req.body;
   const talkers = await readFile(pathName);
  const editTalker = talkers.find((talker) => talker.id === Number(id));
  editTalker.id = Number(id);
  editTalker.name = name;
  editTalker.age = age;
  editTalker.talk.watchedAt = watchedAt;
  editTalker.talk.rate = rate;
  await writeFile(pathName, talkers);
  res.status(HTTP_OK_STATUS).json(editTalker);
 } catch (error) {
  console.error(error);
 }
});

app.delete('/talker/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await readFile(pathName);
    const talkerIndex = talkers.findIndex((talker) => talker.id === Number(id));
    talkers.splice(talkerIndex, 1);
    await writeFile(pathName, talkers);
    res.status(204).json();
  } catch (error) {
     console.error(error);
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
