// Getting args
const args = require('minimist')(process.argv.slice(2))
const PORT = args.p || process.env.PORT || '5001'

// Importing 
let express = require('express');
let app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('etag', 'strong')

Users = require('./models/Creds');
Resume = require('./models/Resume')

// Routes
app.get('/', (request, response) => {
    response.json(Resume)
})

app.use('/basics', require('./routes/Basics').basics)
app.use('/work', require('./routes/Works').works)
app.use('/volunteer', require('./routes/Volunteers').volunteers)
app.use('/education', require('./routes/Educations').educations)
app.use('/award', require('./routes/Awards').awards)
app.use('/publication', require('./routes/Publications').publications)
app.use('/skill', require('./routes/Skills').skills)
app.use('/language', require('./routes/Languages').languages)
app.use('/interest', require('./routes/Interests').interests)
app.use('/reference', require('./routes/References').references)

// Starting server
app.listen(PORT, '0.0.0.0', () => {
    console.log("inicie correctamente")
})