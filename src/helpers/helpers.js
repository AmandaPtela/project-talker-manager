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

module.exports = {
    getTalkers,
    getUser,
    gerarToken,
};