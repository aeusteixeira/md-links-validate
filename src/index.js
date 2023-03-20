import fs from 'fs';
import chalk from 'chalk';

const handleError = error => {
    throw new Error(chalk.red(error.code, 'arquivo não encontrado.'));
}

const extractLinksFromText = text => {
    const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
    const captures = [...text.matchAll(regex)]
    const response = captures.map(data => ({
        [data[1]]: data[2]
    }))
    return response.length !== 0 ? response : 'Não há links no arquivo informado.';
}

async function getFile(path){
    try {
        const response = await fs.promises.readFile(path, 'utf8')
        return extractLinksFromText(response)
    } catch (error) {
        console.log(handleError(error))
    }
}

export default getFile;