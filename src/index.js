const express = require('express');
const fs = require('fs').promises;
const {
  getTalkers,
  gerarToken,
  auth,
  nameOk,
  ageOk,
  talkOk,
  talkKeys,
  rateOk,
  rateOkPUT,
  rateOkPUT2,
} = require('./helpers/helpers');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send('ok');
});

//  Listar talker específico
app.get('/talker/search', auth, async (_request, response) => {
  const { q } = _request.query;
  const talkers = await getTalkers();
  const talker = talkers.filter((i) => i.name.toUpperCase().includes(q));

  response.status(200).json(talker);
});

app.get('/talker/:id', async (_request, response) => {
  const { id } = _request.params;
  const talkers = await getTalkers();
  const talker = talkers.find((i) => i.id === Number(id));
  if (!talker) {
    response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  response.status(HTTP_OK_STATUS).json(talker);
});

// listar talkers
app.get('/talker', async (_request, response) => {
  const talkers = await getTalkers();
    response.status(HTTP_OK_STATUS).json(talkers);
});

//  endpoint login
/* app.get('/login', (_request, response) => {
  const user = getUser();
  user.push(_request.body);
  response.status(HTTP_OK_STATUS).json(user,{'token': gerarToken()})
}); */ 

// validações
const validationLogin = (_request, response, next) => {
  const regexEmail = /^\S+@\S+\.\S+$/;
  const { email, password } = _request.body;
  if (!email) {
    return response.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!regexEmail.test(email)) {
    return response.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return response.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  
  if (password.length < 6) {
    return response.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

// Endpoind de token do login
app.post('/login', validationLogin, (_request, _response) => {
  const token = gerarToken();

  return _response.status(HTTP_OK_STATUS).json({ token });
});

// criação de talker
app.post('/talker', auth, nameOk, ageOk, talkOk, talkKeys, rateOk, async (_request, response) => {
  const reqBody = _request.body;
  const talkers = await getTalkers();
  const path = 'src/talker.json';
  
  const addId = talkers.length + 1;
  const newTalker = { id: addId, ...reqBody };
  /* const attList = JSON.stringify(newTalker}); */
  talkers.push(newTalker);

  await fs.writeFile(path, JSON.stringify(talkers));
  if (reqBody) {
    return response.status(201).json(newTalker);
  }
});

app.put('/talker/:id', auth, nameOk, ageOk, talkOk,
 talkKeys, rateOkPUT, rateOkPUT2, async (_request, response) => {
  const reqBody = _request.body;
  const id = Number(_request.params.id);
  const path = 'src/talker.json';
  const talkers = await getTalkers();

  const select = Object.values(talkers)/* ((t) => t.id === id) */;
  const print = select.find((t) => t.id === id);
  
  const newTalk = {
    id: print.id,
    ...reqBody,
  };
  await fs.writeFile(path, JSON.stringify([newTalk]));
  response.status(200).json(newTalk);
});

app.delete('/talker/:id', auth, async (_request, response) => {
  const id = Number(_request.params.id);
  const path = 'src/talker.json';
  const talkers = await getTalkers();

  const select = Object.values(talkers);
  const semTalker = select.filter((t) => t.id !== id);

  await fs.writeFile(path, JSON.stringify([semTalker]));
  response.status(204).json(semTalker);
});

app.listen(PORT, () => {
  console.log('Online agora');
});
