const crypto = require('crypto');

const fs = require('fs').promises;

async function getTalkers() {
    try {
        const data = await fs.readFile('./src/talker.json', 'utf-8');
        const talkers = JSON.parse(data);
        return talkers;
    } catch (error) {
        console.error(`Erro na leitura do arquivo: ${error}`);
        return [];
    }
}

const getUser = (/* nome, email, password */) => {
    const data = { 
/*         nome: nome,
        email: email,
        password: password,
        token: '', */
    };
    return data;
};

function gerarToken() {
    const token = crypto.randomBytes(8).toString('hex');
    return token;
}

// validações talker
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
        return response.status(400)
        .json({ message: 'A pessoa palestrante deve ser maior de idade' });
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
  const errorM = 'O campo "rate" deve ser um inteiro de 1 à 5'; 
  const rateOk = (_request, response, next) => {
    const { talk } = _request.body;
    const { rate } = talk;
    // const regexRate = /^[1-5]\d{0,5}$/;
    const rateN = Number(rate);
    if (!rate) {
      return response.status(400).json({ message: 'O campo "rate" é obrigatório' });
    }
    if (!Number.isInteger(rateN)) {
      return response.status(400).json({ message: `${errorM}` });
    }
    if (rateN < 1 || rateN > 5) {
      return response.status(400).json({ message: `${errorM}` });
    }
    next();
  };
  
  const rateOkPUT = (_request, response, next) => {
    const { talk } = _request.body;
    const { rate } = talk;
    const rateN = Number(rate);
    // const regexRate = /^[1-5]\d{0,5}$/;
    if (rateN < 1) {
      return response.status(400).json({ message: `${errorM}` });
    }
    if (rateN > 5) {
      return response.status(400).json({ message: `${errorM}` });
    }
    if (!rateN) {
      return response.status(400).json({ message: 'O campo "rate" é obrigatório' });
    }
    next();
  };
  
  const rateOkPUT2 = (_request, response, next) => {
    const { talk } = _request.body;
    const { rate } = talk;
    const rateN = Number(rate);
    if (!Number.isInteger(rateN)) {
      return response.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
    }
    next();
  };

module.exports = {
    getTalkers,
    getUser,
    gerarToken,
    auth,
    nameOk,
    ageOk,
    talkOk,
    talkKeys,
    rateOk,
    rateOkPUT,
    rateOkPUT2,
};