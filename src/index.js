let express = require('express');
let app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('etag', 'strong')

Users = require('./models/Creds');
Resume = require('./models/Resume')

app.get('/', (request, response) => {
    response.json(Resume)
})

app.use('/basics', require('./routes/Basics').basics)
app.use('/work', require('./routes/Works').works)
app.use('/volunteer', require('./routes/Volunteers').volunteers)
app.use('/education', require('./routes/Educations').educations)

app.listen(5001, '0.0.0.0', () => {
    console.log("inicie correctamente")
})