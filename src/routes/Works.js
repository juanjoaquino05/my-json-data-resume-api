const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')

let works = express.Router()

works.get('/', (request, response) => {
    return response.json(Resume.work)
});

works.use(basicAuth({
    users: Users
}))

works.put('/:company', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.work))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    let requiredParams = ['company', 'position', 'website', 'startDate', 'endDate', 'summary', 'highlights']

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let work = {
        company: request.body.company,
        position: request.body.position,
        website: request.body.website,
        startDate: request.body.startDate,
        endDate: request.body.endDate,
        summary: request.body.summary,
        highlights: request.body.highlights
    }

    let elementExist = Resume.work.some((element) =>{
        return element.company.toLowerCase() === request.params.company.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Work doesnt exist! "})
    
    Resume.work.forEach((element, index) => {
        if(element.company.toLowerCase() === request.params.company.toLowerCase()) {
            Resume.work[index] = work
        }
    });

    return response.status(200).json(Resume.work)
});

works.post('/', (request, response) => {
    let requiredParams = ['company', 'position', 'website', 'startDate', 'endDate', 'summary', 'highlights']

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let elementExist = Resume.work.some((element) =>{
        return element.company.toLowerCase() === request.body.company.toLowerCase()
    })
    
    let work = {
        company: request.body.company,
        position: request.body.position,
        website: request.body.website,
        startDate: request.body.startDate,
        endDate: request.body.endDate,
        summary: request.body.summary,
        highlights: request.body.highlights
    }

    if(elementExist) return response.status(500).json({message: "Work already exist! "})
    
    Resume.work.push(work)

    return response.status(200).json(Resume.work)
});

works.patch('/:company', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.work))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    let requiredParams = ['company', 'position', 'website', 'startDate', 'endDate', 'summary', 'highlights']

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.work.some((element) =>{
        return element.company.toLowerCase() === request.params.company.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Work doesnt exist! "})

    
    Resume.work.forEach((element, index) => {
        if(element.company.toLowerCase() === request.params.company.toLowerCase()) {
            Object.assign(Resume.work[index], request.body);
        }
    });

    return response.status(200).json(Resume.work)
});

works.delete('/:company', (request, response) => {
    let elementExist = Resume.work.some((element) =>{
        return element.company.toLowerCase() === request.params.company.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Work doesnt exist! "})
    
    let deletedElement
    
    Resume.work.forEach((element, index) => {
        if(element.company.toLowerCase() === request.params.company.toLowerCase()) {
            deletedElement = Resume.work[index]

            Resume.work.splice(index, 1);
        }
    });

    return response.status(200).json(deletedElement)
});

module.exports.works = works