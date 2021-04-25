let express = require('express')
let app = express()

let Resume = require('./models/Resume')

app.get('/', (request, response) => {
    response.json(Resume);
})

app.listen(5001)