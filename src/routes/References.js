const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')
const requiredParams = ['name', 'reference']

let references = express.Router()

references.get('/', (request, response) => {
    return response.json(Resume.references)
});

references.use(basicAuth({
    users: Users
}))

references.put('/:name', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.references))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let reference = { 
        name: request.body.name,
        reference: request.body.reference,
    }

    let elementExist = Resume.references.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "reference doesnt exist! "})
    
    Resume.references.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            Resume.references[index] = reference
        }
    });

    return response.status(200).json(Resume.references)
});

references.post('/', (request, response) => {
    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let elementExist = Resume.references.some((element) =>{
        return element.name.toLowerCase() === request.body.name.toLowerCase()
    })
    
    let reference = { 
        name: request.body.name,
        reference: request.body.reference,
    }

    if(elementExist) return response.status(500).json({message: "reference already exist! "})
    
    Resume.references.push(reference)

    return response.status(200).json(Resume.references)
});

references.patch('/:name', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.references))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.references.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "reference doesnt exist! "})

    
    Resume.references.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            Object.assign(Resume.references[index], request.body);
        }
    });

    return response.status(200).json(Resume.references)
});

references.delete('/:name', (request, response) => {
    let elementExist = Resume.references.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "reference doesnt exist! "})
    
    let deletedElement
    
    Resume.references.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            deletedElement = Resume.references[index]

            Resume.references.splice(index, 1);
        }
    });

    return response.status(200).json(deletedElement)
});

module.exports.references = references