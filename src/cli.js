#!/usr/bin/env node

import getFile from './index.js';
import fs from 'fs'
import chalk from 'chalk';
import validatedList from './http-validacao.js';

const path = process.argv;

async function printList(validates, response, name = ''){
    if(validates){
        console.log(
            chalk.yellow('LISTA VALIDADA:'),
            chalk.black.bgGreen(name),
            await validatedList(response)
            )
    }else{
        console.log(
            chalk.yellow('LISTA DE LINKS:'),
            chalk.black.bgGreen(name),
            response)
    }
}

async function processText(expectedArguments){

    const path = expectedArguments[2];
    const validate = expectedArguments[3] === '--valida';
    
    try { 
        fs.lstatSync(path)
    } catch (error) {
        if(error.code === 'ENOENT'){
            console.log(chalk.red('Arquivo ou diretório não encontrado ou não existe'))
            return;
        }     
    }

    if(fs.lstatSync(path).isFile()){
        const response = await getFile(path);
        printList(validate, response)

    }else if(fs.lstatSync(path).isDirectory()){
        const files = await fs.promises.readdir(path);
        files.forEach(async (file) => {
            const list = await getFile(`${path}/${file}`);
            printList(validate, list, file)
        });
    }
}

processText(path)