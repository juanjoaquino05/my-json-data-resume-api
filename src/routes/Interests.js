const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')
const requiredParams = ['name', 'keywords']

let interests = express.Router()

interests.get('/', (request, response) => {
    return response.json(Resume.interests)
});

interests.use(basicAuth({
    users: Users
}))

interests.put('/:name', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.interests))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let interest = { 
        name: request.body.name,
        keywords: request.body.keywords,
    }

    let elementExist = Resume.interests.some((element) =>{
        console.log(element.name.toLowerCase())
        console.log(element.name.toLowerCase())
        
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "interest doesnt exist! "})
    
    Resume.interests.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            Resume.interests[index] = interest
        }
    });

    return response.status(200).json(Resume.interests)
});

interests.post('/', (request, response) => {
    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let elementExist = Resume.interests.some((element) =>{
        return element.name.toLowerCase() === request.body.name.toLowerCase()
    })
    
    let interest = { 
        name: request.body.name,
        keywords: request.body.keywords,
    }

    if(elementExist) return response.status(500).json({message: "interest already exist! "})
    
    Resume.interests.push(interest)

    return response.status(200).json(Resume.interests)
});

interests.patch('/:name', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.interests))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.interests.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "interest doesnt exist! "})

    
    Resume.interests.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            Object.assign(Resume.interests[index], request.body);
        }
    });

    return response.status(200).json(Resume.interests)
});

interests.delete('/:name', (request, response) => {
    let elementExist = Resume.interests.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "interest doesnt exist! "})
    
    let deletedElement
    
    Resume.interests.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            deletedElement = Resume.interests[index]

            Resume.interests.splice(index, 1);
        }
    });

    return response.status(200).json(deletedElement)
});

module.exports.interests = interests