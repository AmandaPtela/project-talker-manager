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
const auth = (_request, response, next) => {
  const { authorization } = _request.headers;
  if (!authorization) {
    return response.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16 || typeof authorization !== 'string') {
    return response.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const nameOk = (_request, response, next) => {
  const { name } = _request.body;
    if (!name) {
      return response.status(400).json({ message: 'O campo "name" é obrigatório' });
    }
    if (name.length < 3) {
      return response.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
  next();
};

const ageOk = (_request, response, next) => {
  const { age } = _request.body;
    if (!age) {
      return response.status(400).json({ message: 'O campo "age" é obrigatório' });
    }
    if (age < 18) {
      return response.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
    }
  next();
};

const talkOk = (_request, response, next) => {
  const { talk } = _request.body;
  if (!talk) {
    return response.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

const talkKeys = (_request, response, next) => {
  const { talk } = _request.body;
  const { watchedAt } = talk;
  const regexData = /\d{2}\/\d{2}\/\d{4}/gm;
  
  if (!watchedAt) {
    return response.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!regexData.test(watchedAt)) {
    return response.status(400)
    .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const rateOk = (_request, response, next) => {
  const { talk } = _request.body;
  const { rate } = talk;
  const regexRate = /^[1-5]\d{0,5}$/;
  const rateN = Number(rate);
    if (!rate) {
    return response.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (typeof rateN !== 'number') {
    return response.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (regexRate.test(rateN)) {
    return response.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (!rateN < 9) {
    return response.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
    next();
};

  app.post('/talker', auth, nameOk, ageOk, talkOk, talkKeys, rateOk, async (_request, response) => {
    const newTalker = _request.body;
    return response.status(201).json(newTalker);
  });
app.listen(PORT, () => {
  console.log('Online agora');
});
