let express = require('express')
let app = express()

app.get('/', (request, response) => {
    console.log("inicie correctamente!! ")
})

app.listen(5001)