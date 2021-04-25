const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')
const requiredParams = ['institution', 'area', 'studyType', 'startDate', 'endDate', 'gpa', 'courses']

let educations = express.Router()

educations.get('/', (request, response) => {
    return response.json(Resume.education)
});

educations.use(basicAuth({
    users: Users
}))

educations.put('/:institution', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.education))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let work = {
        institution: request.body.institution,
        area: request.body.area,
        studyType: request.body.studyType,
        startDate: request.body.startDate,
        endDate: request.body.endDate,
        gpa: request.body.gpa,
        courses: request.body.courses
    }

    let elementExist = Resume.education.some((element) =>{
        return element.institution.toLowerCase() === request.params.institution.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Work doesnt exist! "})
    
    Resume.education.forEach((element, index) => {
        if(element.institution.toLowerCase() === request.params.institution.toLowerCase()) {
            Resume.education[index] = work
        }
    });

    return response.status(200).json(Resume.education)
});

educations.post('/', (request, response) => {
    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let elementExist = Resume.education.some((element) =>{
        return element.institution.toLowerCase() === request.body.institution.toLowerCase()
    })
    
    let work = {
        institution: request.body.institution,
        area: request.body.area,
        studyType: request.body.studyType,
        startDate: request.body.startDate,
        endDate: request.body.endDate,
        gpa: request.body.gpa,
        courses: request.body.courses
    }

    if(elementExist) return response.status(500).json({message: "Education already exist! "})
    
    Resume.education.push(work)

    return response.status(200).json(Resume.education)
});

educations.patch('/:institution', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.education))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.education.some((element) =>{
        return element.institution.toLowerCase() === request.params.institution.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Education doesnt exist! "})

    
    Resume.education.forEach((element, index) => {
        if(element.institution.toLowerCase() === request.params.institution.toLowerCase()) {
            Object.assign(Resume.education[index], request.body);
        }
    });

    return response.status(200).json(Resume.education)
});

educations.delete('/:institution', (request, response) => {
    let elementExist = Resume.education.some((element) =>{
        return element.institution.toLowerCase() === request.params.institution.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Education doesnt exist! "})
    
    let deletedElement
    
    Resume.education.forEach((element, index) => {
        if(element.institution.toLowerCase() === request.params.institution.toLowerCase()) {
            deletedElement = Resume.education[index]

            Resume.education.splice(index, 1);
        }
    });

    return response.status(200).json(deletedElement)
});

module.exports.educations = educations