const fs = require('fs').promises;
const path = require('path');

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

module.exports = {
    getTalkers,
};