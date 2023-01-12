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

async function getUser() {
    try {
        const data = { 'email': '', 'password': '', 'token': ''}
        const users = JSON.parse(data);
        return users;
    } catch (error) {
        console.error(`Erro na leitura do arquivo: ${error}`);
        return [];
    }
}

function gerarToken() {
    let token = crypto.randomBytes(8).toString('hex');
    return token;
}

module.exports = {
    getTalkers,
    getUser,
    gerarToken,
};