const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')
const requiredParams = ['name', 'publisher', 'releaseDate', 'website', 'summary']

let publications = express.Router()

publications.get('/', (request, response) => {
    return response.json(Resume.publications)
});

publications.use(basicAuth({
    users: Users
}))

publications.put('/:name', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.publications))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let publication = { 
        name: request.body.name,
        publisher: request.body.publisher,
        releaseDate: request.body.releaseDate,
        website: request.body.website,
        summary: request.body.summary,
    }

    let elementExist = Resume.publications.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "publication doesnt exist! "})
    
    Resume.publications.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            Resume.publications[index] = publication
        }
    });

    return response.status(200).json(Resume.publications)
});

publications.post('/', (request, response) => {
    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let elementExist = Resume.publications.some((element) =>{
        return element.name.toLowerCase() === request.body.name.toLowerCase()
    })
    
    let publication = { 
        name: request.body.name,
        publisher: request.body.publisher,
        releaseDate: request.body.releaseDate,
        website: request.body.website,
        summary: request.body.summary,
    }

    if(elementExist) return response.status(500).json({message: "publication already exist! "})
    
    Resume.publications.push(publication)

    return response.status(200).json(Resume.publications)
});

publications.patch('/:name', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.publications))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.publications.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "publication doesnt exist! "})

    
    Resume.publications.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            Object.assign(Resume.publications[index], request.body);
        }
    });

    return response.status(200).json(Resume.publications)
});

publications.delete('/:name', (request, response) => {
    let elementExist = Resume.publications.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "publication doesnt exist! "})
    
    let deletedElement
    
    Resume.publications.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            deletedElement = Resume.publications[index]

            Resume.publications.splice(index, 1);
        }
    });

    return response.status(200).json(deletedElement)
});

module.exports.publications = publications