const express = require('express')
const app = express()
const request = require('request')
const morgan = require('morgan')
const path = require('path')
const url = require('url')
const aboutme = require('./aboutme.json')
const port = process.env.PORT || 3001

//setup middleware
app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'views')))

//set up port
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`)
})

//fetches json api & serves static page 'posts' with data
app.get('/posts', (req, res, next) => {
    request('https://jsonplaceholder.typicode.com/posts', (err, response) => {
            if (!err) {
                const dataArr = JSON.parse(response.body)
                res.render('posts', {data: dataArr} )
            } else {
                next(err)
            }
    })
})

// input url query i.e localhost:3001/aboutme?description
// returns json to query
app.get('/aboutme', (req, res) => {
    let query = url.parse(req.url).query
    
    switch (query){
        case 'description':
            res.json(aboutme.description)
        case 'tech':
            res.json(aboutme.tech)
        case 'techstack':
            res.json(aboutme.techstack)
        case 'hobbies':
            res.json(aboutme.hobbies)
        default:
            res.json(aboutme)
    }
})

// error handling when page not found
app.get('*', (req, res, next) => {
    const error = new Error('The page you are looking for could not be found :(')
    error.statusCode = 404
    next(error)
})

//set up error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode ? err.statusCode : 500
    const message = err.message ? err.message : 'Internal server error!'
    res.status(err.status || 500)
    res.render('errorPage', {statusCode, message})
})
