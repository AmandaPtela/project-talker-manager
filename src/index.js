const express = require('express');
const { getTalkers } = require('./helpers/helpers');

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

// adicionar talker
/* app.post('/talkerAdd', (_request, response) => {
  const talkers = require('./talker.json');
  talkers.push(_request.body);
  response.status(HTTP_OK_STATUS).json({talkers});
}); */

app.listen(PORT, () => {
  console.log('Online agora');
});
