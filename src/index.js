const express = require('express');
const { getTalkers, getUser, gerarToken } = require('./helpers/helpers');

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

//Listar talker específico
app.get('/talker/:id', async (_request, response) => {
  const { id } = _request.params;
  const data = await getTalkers();
  const talker = data.find((i) => i.id === Number(id));
  if (!talker) {
    response.status(404).json({message: 'Pessoa palestrante não encontrada'});
  }
  response.status(HTTP_OK_STATUS).json(talker);
});

//endpoint login
/* app.get('/login', (_request, response) => {
  const user = getUser();
  user.push(_request.body);
  response.status(HTTP_OK_STATUS).json(user,{'token': gerarToken()})
}); */

// Endpoind de token do login
app.post('/login', (_request, response) => {
  const user = getUser(_request.body);
  response.status(200).json(
    { token: gerarToken() }
  )
});

// adicionar talker
/* app.post('/talkerAdd', (_request, response) => {
  const talkers = require('./talker.json');
  talkers.push(_request.body);
  response.status(HTTP_OK_STATUS).json({talkers});
}); */

app.listen(PORT, () => {
  console.log('Online agora');
});
