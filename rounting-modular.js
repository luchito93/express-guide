const express = require('express')
const rounter = express.Router()

//Middleware that is especific to this router
rounter.use((req, res, next) => {
    console.log('la hora del pajaro es', Date.now())
    next()
})

//Validate middleware and trigger error hanler on routing.js birds route
rounter.use((req, res, next) => {
    if (req.headers.authorization === 'Bearer mitoken') return next()
    // rederigir al error handler del app use de birds en routen.js
    next('router')
})


//Extra middleware only for about
const logOriginalUrl = (req, res, next) => {
    console.log('Request url about: ', req.originalUrl)
    next()
}

const logMethod = (req, res, next) => {
    console.log('Request type about:', req.method)
    next()
}

rounter.use('/about', [logOriginalUrl, logMethod])

// routes for this module routine


rounter.get('/', (req, res) => {
    res.send('Birds home page')
})

rounter.get('/about', (req, res, next) => {
    if (req.query?.especial) {
        // se usa route para pasar a la otra ruta de /about
        next('route')
    } else {
        res.send('Bires about page')
    }
})

rounter.get('/example', (req, res, next) => {
    res.send('eeste no se usa')
})

rounter.get('/about', (req, res, next) => {
    res.send('Birs con query paramas special')
})


module.exports = rounter