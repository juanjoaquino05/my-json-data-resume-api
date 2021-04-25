const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')

let volunteers = express.Router()

volunteers.get('/', (request, response) => {
    return response.json(Resume.volunteer)
});

volunteers.use(basicAuth({
    users: Users
}))

volunteers.put('/:organization', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.volunteer))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    let requiredParams = ['organization', 'position', 'website', 'startDate', 'endDate', 'summary', 'highlights']

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let volunteer = {
        organization: request.params.organization,
        position: request.body.position,
        website: request.body.website,
        startDate: request.body.startDate,
        endDate: request.body.endDate,
        summary: request.body.summary,
        highlights: request.body.highlights
    }

    let elementExist = Resume.volunteer.some((element) =>{
        return element.organization.toLowerCase() === request.params.organization.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "volunteer doesnt exist! "})
    
    Resume.volunteer.forEach((element, index) => {
        if(element.organization.toLowerCase() === request.params.organization.toLowerCase()) {
            Resume.volunteer[index] = volunteer
        }
    });

    return response.status(200).json(Resume.volunteer)
});

volunteers.post('/', (request, response) => {
    let requiredParams = ['organization', 'position', 'website', 'startDate', 'endDate', 'summary', 'highlights']

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let elementExist = Resume.volunteer.some((element) =>{
        return element.organization.toLowerCase() === request.body.organization.toLowerCase()
    })
    
    let volunteer = {
        organization: request.body.organization,
        position: request.body.position,
        website: request.body.website,
        startDate: request.body.startDate,
        endDate: request.body.endDate,
        summary: request.body.summary,
        highlights: request.body.highlights
    }

    if(elementExist) return response.status(500).json({message: "volunteer already exist! "})
    
    Resume.volunteer.push(volunteer)

    return response.status(200).json(Resume.volunteer)
});

volunteers.patch('/:organization', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.volunteer))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    let requiredParams = ['organization', 'position', 'website', 'startDate', 'endDate', 'summary', 'highlights']

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.volunteer.some((element) =>{
        return element.organization.toLowerCase() === request.params.organization.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "volunteer doesnt exist! "})

    
    Resume.volunteer.forEach((element, index) => {
        if(element.organization.toLowerCase() === request.params.organization.toLowerCase()) {
            Object.assign(Resume.volunteer[index], request.body);
        }
    });

    return response.status(200).json(Resume.volunteer)
});

volunteers.delete('/:organization', (request, response) => {
    let elementExist = Resume.volunteer.some((element) =>{
        return element.organization.toLowerCase() === request.params.organization.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "volunteer doesnt exist! "})
    
    let deletedElement
    
    Resume.volunteer.forEach((element, index) => {
        if(element.organization.toLowerCase() === request.params.organization.toLowerCase()) {
            deletedElement = Resume.volunteer[index]

            Resume.volunteer.splice(index, 1);
        }
    });

    return response.status(200).json(deletedElement)
});

module.exports.volunteers = volunteers