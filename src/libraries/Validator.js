const validateRequiredParams = function (body, params, all) {
    if(all){
        let validation = true
        params.forEach(element => {
            validation = validation && body.hasOwnProperty(element)
        })

        return validation
    }else{
        
        let validation = true
        params.forEach(element => {
            validation = validation || body.hasOwnProperty(element)
        })
        return validation
    }
}

module.exports.validateRequiredParams = validateRequiredParams