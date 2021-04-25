let express = require('express')
let app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Resume = require('./models/Resume')

app.get('/', (request, response) => {
    response.json(Resume)
})

app.use('/basics', require('./routes/Basics').basics)

app.listen(5001, '0.0.0.0', () => {
    console.log("inicie correctamente")
})