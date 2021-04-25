const validateRequiredParams = function (body, params, all) {
    if(all){
        let exists = true
        params.forEach(element => {
            exists = exists && body.hasOwnProperty(element)
        })

        return exists
    }else{
        params.forEach(element => {
            if(body.hasOwnProperty(element)) return true
        })
    }
}

module.exports.validateRequiredParams = validateRequiredParams