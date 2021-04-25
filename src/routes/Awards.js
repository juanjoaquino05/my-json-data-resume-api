const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')
const requiredParams = ['title', 'date', 'awarder', 'summary']

let awards = express.Router()

awards.get('/', (request, response) => {
    return response.json(Resume.awards)
});

awards.use(basicAuth({
    users: Users
}))

awards.put('/:title', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.awards))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let award = {
        title: request.body.title,
        date: request.body.date,
        awarder: request.body.awarder,
        summary: request.body.summary,
    }

    let elementExist = Resume.awards.some((element) =>{
        return element.title.toLowerCase() === request.params.title.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Award doesnt exist! "})
    
    Resume.awards.forEach((element, index) => {
        if(element.title.toLowerCase() === request.params.title.toLowerCase()) {
            Resume.awards[index] = award
        }
    });

    return response.status(200).json(Resume.awards)
});

awards.post('/', (request, response) => {
    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let elementExist = Resume.awards.some((element) =>{
        return element.title.toLowerCase() === request.body.title.toLowerCase()
    })
    
    let award = {
        title: request.body.title,
        date: request.body.date,
        awarder: request.body.awarder,
        summary: request.body.summary,
    }

    if(elementExist) return response.status(500).json({message: "Education already exist! "})
    
    Resume.awards.push(award)

    return response.status(200).json(Resume.awards)
});

awards.patch('/:title', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.awards))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.awards.some((element) =>{
        return element.title.toLowerCase() === request.params.title.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Education doesnt exist! "})

    
    Resume.awards.forEach((element, index) => {
        if(element.title.toLowerCase() === request.params.title.toLowerCase()) {
            Object.assign(Resume.awards[index], request.body);
        }
    });

    return response.status(200).json(Resume.awards)
});

awards.delete('/:title', (request, response) => {
    let elementExist = Resume.awards.some((element) =>{
        return element.title.toLowerCase() === request.params.title.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Education doesnt exist! "})
    
    let deletedElement
    
    Resume.awards.forEach((element, index) => {
        if(element.title.toLowerCase() === request.params.title.toLowerCase()) {
            deletedElement = Resume.awards[index]

            Resume.awards.splice(index, 1);
        }
    });

    return response.status(200).json(deletedElement)
});

module.exports.awards = awards