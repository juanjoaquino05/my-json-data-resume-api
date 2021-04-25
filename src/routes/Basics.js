let express = require('express')
let basics = express.Router()
let {validateRequiredParams} = require('../libraries/Validator') 

basics.get('/', (request, response) => {
    console.log(Resume)
    return response.json(Resume.basics)
});

basics.put('/', (request, response) => {
    
    let basics = {
        "name": request.body.name,
        "label": request.body.label,
        "picture": request.body.picture,
        "email": request.body.email,
        "phone": request.body.phone,
        "website": request.body.website,
        "summary": request.body.summary,
        "location": request.body.location,
        "profiles": request.body.profiles
    }

    Resume.basics = basics

    return response.status(200).json(Resume.basics)
});

basics.patch('/', (request, response) => {
    let requiredParams = [
        'name', 'label', 'picture', 'email', 'phone', 'website', 'summary', 'location', 'profiles', 
    ]

    if(!validateRequiredParams(request.body, requiredParams, false)) 
        return response.status(500).json({message: "Param missing!"})
    
    Object.assign(Resume.basics, request.body);
        
    return response.status(200).json(Resume.basics)
});

basics.use('/profile', require('./Profiles').profiles)

module.exports.basics = basics