import chalk from "chalk";

const extractLinks = links => {
    return links.map((link) => Object.values(link).join());
}

const checkStatus = async urls => {
    const status = await Promise.all(
        urls.map(async (url) => {
            try {
                const response = await fetch(url);
                return response.status;
            } catch (error) {
                return handleError(error)
            }
        })
    );
    return status;
}

const handleError = error => {
    if(error.cause.code === 'ENOTFOUND'){
        return 'Ops, o link não foi encontrado :(';
    }else{
        return 'Não sei dizer o que aconteceu, mas há algo de errado com esse link! =0'
    }
}

export default async function validatedList(links) {
    const response = extractLinks(links);
    const status = await checkStatus(response)
    
    return links.map((link, index) => ({
        ...link,
        status: status[index]
    }))
}
