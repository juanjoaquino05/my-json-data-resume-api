const etag = require('etag');
let express = require('express')
let {validateRequiredParams} = require('../libraries/Validator')
const basicAuth = require('express-basic-auth')

let profiles = express.Router()

profiles.get('/', (request, response) => {
    return response.json(Resume.basics.profiles)
});

profiles.use(basicAuth({
    users: Users
}))

profiles.put('/:network', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.basics.profiles))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, ['network', 'username', 'url'], true)) 
        return response.status(500).json({message: "Param missing! "})
    
    let profile = {
        network: request.params.network,
        username: request.body.username,
        url: request.body.url
    }

    let elementExist = Resume.basics.profiles.some((element) =>{
        return element.network.toLowerCase() === request.params.network.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Profile doesnt exist! "})
    
    Resume.basics.profiles.forEach((element, index) => {
        if(element.network.toLowerCase() === request.params.network.toLowerCase()) {
            Resume.basics.profiles[index] = profile
        }
    });

    return response.status(200).json(Resume.basics.profiles)
});

profiles.post('/', (request, response) => {
    console.log(request.body)
    if(!validateRequiredParams(request.body, ['network', 'username', 'url'], true)) 
        return response.status(500).json({message: "Param missing! "})

    let profile = {
        network: request.body.network,
        username: request.body.username,
        url: request.body.url
    }
    
    let elementExist = Resume.basics.profiles.some((element) =>{
        return element.network.toLowerCase() === request.body.network.toLowerCase()
    })

    if(elementExist) return response.status(500).json({message: "Profile already exist! "})
    
    Resume.basics.profiles.push(profile)

    return response.status(200).json(Resume.basics.profiles)
});

profiles.patch('/:network', (request, response) => {
    if(!request.headers['if-match'])
        return response.status(400).send()
        
    let cachedEtag = etag(JSON.stringify(Resume.basics.profiles))
    
    if(request.headers['if-match'] !== cachedEtag){
        return response.status(409).send()
    }

    if(!validateRequiredParams(request.body, ['network', 'username', 'url'], false)) 
        return response.status(500).json({message: "Param missing! "})

    let elementExist = Resume.basics.profiles.some((element) =>{
        return element.network.toLowerCase() === request.params.network.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Profile doesnt exist! "})

    
    Resume.basics.profiles.forEach((element, index) => {
        if(element.network.toLowerCase() === request.params.network.toLowerCase()) {
            Object.assign(Resume.basics.profiles[index], request.body);
            // if(request.body.username) Resume.basics.profiles[index].username = request.body.username
            // if(request.body.url) Resume.basics.profiles[index].url = request.body.url
            // if(request.body.network) Resume.basics.profiles[index].network = request.body.network
        }
    });

    return response.status(200).json(Resume.basics.profiles)
});

profiles.delete('/:network', (request, response) => {
    let elementExist = Resume.basics.profiles.some((element) =>{
        return element.network.toLowerCase() === request.params.network.toLowerCase()
    })

    if(!elementExist) return response.status(404).json({message: "Profile doesnt exist! "})
    
    let deletedProfile
    Resume.basics.profiles.forEach((element, index) => {
        if(element.network.toLowerCase() === request.params.network.toLowerCase()) {
            deletedProfile = Resume.basics.profiles[index]

            Resume.basics.profiles.splice(index, 1);
        }
    });

    return response.status(200).json(deletedProfile)
});

module.exports.profiles = profiles