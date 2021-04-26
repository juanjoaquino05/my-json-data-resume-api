const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')
const requiredParams = ['name', 'level', 'keywords']

let skills = express.Router()

skills.get('/', (request, response) => {
    return response.json(Resume.skills)
});

skills.use(basicAuth({
    users: Users
}))

skills.put('/:name', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.skills))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let skill = { 
        name: request.body.name,
        level: request.body.level,
        keywords: request.body.keywords,
    }

    let elementExist = Resume.skills.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "skill doesnt exist! "})
    
    Resume.skills.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            Resume.skills[index] = skill
        }
    });

    return response.status(200).json(Resume.skills)
});

skills.post('/', (request, response) => {
    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let elementExist = Resume.skills.some((element) =>{
        return element.name.toLowerCase() === request.body.name.toLowerCase()
    })
    
    let skill = { 
        name: request.body.name,
        level: request.body.level,
        keywords: request.body.keywords,
    }

    if(elementExist) return response.status(500).json({message: "skill already exist! "})
    
    Resume.skills.push(skill)

    return response.status(200).json(Resume.skills)
});

skills.patch('/:name', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.skills))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.skills.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "skill doesnt exist! "})

    
    Resume.skills.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            Object.assign(Resume.skills[index], request.body);
        }
    });

    return response.status(200).json(Resume.skills)
});

skills.delete('/:name', (request, response) => {
    let elementExist = Resume.skills.some((element) =>{
        return element.name.toLowerCase() === request.params.name.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "skill doesnt exist! "})
    
    let deletedElement
    
    Resume.skills.forEach((element, index) => {
        if(element.name.toLowerCase() === request.params.name.toLowerCase()) {
            deletedElement = Resume.skills[index]

            Resume.skills.splice(index, 1);
        }
    });

    return response.status(200).json(deletedElement)
});

module.exports.skills = skills