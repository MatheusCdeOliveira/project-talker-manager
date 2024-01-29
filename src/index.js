const express = require('express');
const path = require('path');
const CustomError = require('./middlewares/customError');
const { readFile } = require('./utils/readFile');
const generateToken = require('./utils/generateToken');
const { validateLogin } = require('./validations/validateLogin');
const { writeFile } = require('./utils/writeFile');
const auth = require('./middlewares/auth');
const { validateTalker, validateTalkInfo } = require('./validations/validateNewTalker');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const pathName = path.resolve(__dirname, './talker.json');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res, next) => {
  try {
    const talkers = await readFile(pathName);
    return res.status(HTTP_OK_STATUS).json(talkers);
  } catch (error) {
    next(error);
  }
});

app.get('/talker/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const talkers = await readFile(pathName);
    const talkerId = talkers.find((e) => e.id === +id);
    if (!talkerId) throw new CustomError('Pessoa palestrante não encontrada', 404);
    return res.status(HTTP_OK_STATUS).json(talkerId);
  } catch (error) {
    next(error);
  }
});

app.post('/login', validateLogin, (_req, res, next) => {
  try {
    const token = generateToken();
    return res.status(HTTP_OK_STATUS).json({ token }); 
  } catch (error) {
    next();
  }
});

app.post('/talker', auth, validateTalker, validateTalkInfo, async (req, res, next) => {
  try {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkers = await readFile(pathName);
    const newTalker = {
      name,
      age,
      id: talkers[talkers.length - 1].id + 1,
      talk: { watchedAt, rate },
    };
    await writeFile(pathName, [...talkers, newTalker]);
    return res.status(201).json(newTalker);
  } catch (error) {
    next(error);
  }
});

app.put('/talker/:id', auth, validateTalker, validateTalkInfo, async (req, res, next) => {
  try {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const { id } = req.params;
    const talkers = await readFile(pathName);
    const talkerIndex = talkers.findIndex((talker) => talker.id === Number(id));
    if (talkerIndex === -1) throw new CustomError('Pessoa palestrante não encontrada', 404);
    talkers[talkerIndex] = { name, age, id: Number(id), talk: { watchedAt, rate } };
    await writeFile(pathName, talkers);
    return res.status(HTTP_OK_STATUS).json(talkers[talkerIndex]);
  } catch (error) {
    next(error);
  }
});

app.delete('/talker/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const talkers = await readFile(pathName);
    const talkerIndex = talkers.findIndex((talker) => talker.id === Number(id));
    talkers.splice(talkerIndex, 1);
    await writeFile(pathName, talkers);
    return res.status(204).json();
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => res.status(error.statusCode || 500)
.json({ message: error.message }));

app.listen(PORT, () => {
  console.log('Online');
});
