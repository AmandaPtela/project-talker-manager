const express = require('express');
const { getTalkers, gerarToken } = require('./helpers/helpers');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send('ok');
});

// listar talkers
app.get('/talker', async (_request, response) => {
  const talkers = await getTalkers();
    response.status(HTTP_OK_STATUS).json(talkers);
});

//  Listar talker específico
app.get('/talker/:id', async (_request, response) => {
  const { id } = _request.params;
  const data = await getTalkers();
  const talker = data.find((i) => i.id === Number(id));
  if (!talker) {
    response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  response.status(HTTP_OK_STATUS).json(talker);
});

//  endpoint login
/* app.get('/login', (_request, response) => {
  const user = getUser();
  user.push(_request.body);
  response.status(HTTP_OK_STATUS).json(user,{'token': gerarToken()})
}); */ 

// validações
const validation = (_request, response, next) => {
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
app.post('/login', validation, (_request, _response) => {
  const token = gerarToken();

  return _response.status(HTTP_OK_STATUS).json({ token });
});

// adicionar talker
/* app.post('/talker', (_request, response) => {
  const talkers = require('./talker.json');
  talkers.push(_request.body);
  response.status(HTTP_OK_STATUS).json({talkers});
}); */

app.listen(PORT, () => {
  console.log('Online agora');
});
