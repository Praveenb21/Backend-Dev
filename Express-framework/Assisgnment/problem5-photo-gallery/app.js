const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000

const photos = require('./photos')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('gallery', { photos })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
