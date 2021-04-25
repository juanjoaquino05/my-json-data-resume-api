const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')
const requiredParams = ['language', 'fluency']

let languages = express.Router()

languages.get('/', (request, response) => {
    return response.json(Resume.languages)
});

languages.use(basicAuth({
    users: Users
}))

languages.put('/:language', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.languages))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let language = { 
        language: request.body.language,
        fluency: request.body.fluency,
    }

    let elementExist = Resume.languages.some((element) =>{
        console.log(element.language.toLowerCase())
        console.log(element.language.toLowerCase())
        
        return element.language.toLowerCase() === request.params.language.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "language doesnt exist! "})
    
    Resume.languages.forEach((element, index) => {
        if(element.language.toLowerCase() === request.params.language.toLowerCase()) {
            Resume.languages[index] = language
        }
    });

    return response.status(200).json(Resume.languages)
});

languages.post('/', (request, response) => {
    if(!validateRequiredParams(request.body, requiredParams, true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let elementExist = Resume.languages.some((element) =>{
        return element.language.toLowerCase() === request.body.language.toLowerCase()
    })
    
    let language = { 
        language: request.body.language,
        fluency: request.body.fluency,
    }

    if(elementExist) return response.status(500).json({message: "language already exist! "})
    
    Resume.languages.push(language)

    return response.status(200).json(Resume.languages)
});

languages.patch('/:language', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.languages))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.languages.some((element) =>{
        return element.language.toLowerCase() === request.params.language.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "language doesnt exist! "})

    
    Resume.languages.forEach((element, index) => {
        if(element.language.toLowerCase() === request.params.language.toLowerCase()) {
            Object.assign(Resume.languages[index], request.body);
        }
    });

    return response.status(200).json(Resume.languages)
});

languages.delete('/:language', (request, response) => {
    let elementExist = Resume.languages.some((element) =>{
        return element.language.toLowerCase() === request.params.language.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "language doesnt exist! "})
    
    let deletedElement
    
    Resume.languages.forEach((element, index) => {
        if(element.language.toLowerCase() === request.params.language.toLowerCase()) {
            deletedElement = Resume.languages[index]

            Resume.languages.splice(index, 1);
        }
    });

    return response.status(200).json(deletedElement)
});

module.exports.languages = languages