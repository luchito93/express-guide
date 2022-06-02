const express = require('express')
const app = express()
const port = 3333
const birds = require('./rounting-modular')
const { middLog, addReqTime, validateCookiesMidd, errHandlerMidd } = require('./middelware')
const cookieParser = require('cookie-parser')

app.get('/', (req, res) => {
    res.send('hola ponsosssssñass')
})

app.post('/', (req, res) => {
    res.send('haciendo post al home gpae')
})

app.get('/user/:userId/books/:bookId', (req, res) => {
    res.send(req.params)
})

app.get('/multiple-call-back', (req, res, next) => {
    console.log('ejecutando el primer callback')
    next()
}, (req, res) => {
    console.log('ejecutando el segundo callback')
    res.send('hola desde mi segundo callback')
})


// add logmidde and reqtime for all endpoints below (from here ⬇)
// attach middleware to el misi only
app.use('/elmisi', middLog({text: `hora col: ${new Date().toISOString()}`})).use(addReqTime)


app.route('/book').get((req, res) => {
    res.send('Get a random book')
  }).post((req, res) => {
    res.send('Add a book')
  }).put((req, res) => {
    res.send('Update the book')
  })

app.use('/birds', birds, (req, res) => {
    res.status(401).send(`No esta autorizado para
    entrara birds el token es Bearer mitoken,
    a sido validado por el middleware de birds y devuelto con next(router)`)
})

app.get('/elmisi', (req, res) => {
    res.send(`el misi bonito a la hora de ${req.requestTime}`)
})

app.use(cookieParser())


app.get('/elcookieparser', [validateCookiesMidd], (req, res) => {
    // para usar se debe agregar el header Cookie testCookie=luchin;Greet=Hello
    res.send(`retornando el cookie parser ${JSON.stringify(req.cookies)}`)
})

// error handler for all endpoits avobe
app.use(errHandlerMidd)

app.get('/overriding-api-methond', (req, res) => {
    res.sendStatus(401, 'application/json', '{"error": "no esta autorizado criatura"}' )
})

app.get('/overriding-api-prop', (req, res) => {
    res.json({ propIpOverriding: req.ip, header: req.headers['client-ip'] })
})

//Overriding express api method
app.response.sendStatus = function (statusCode, type, message) {
    return this.contentType(type).status(statusCode).send(message)
}
// Overridin express api properties
Object.defineProperty(app.request, 'ip', {
    configurable: true,
    enumerable: true,
    /**
     * el getter del accessor se puede escribir como get () {  } 
     * utilizando el short had method definition
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions
     * 
     * NOta: no se puede escribir con arrow funcion porque se necesita el bind del this que esta
     * bien afuera, que en este caso el this seria app.request
     */
    get: function () {
        // cambia la propiedad ip por la que venga en el header
        // tambien se puede escribir asi this.headers['client-ip']
        return this.get('Client-IP') 
    }
})

// add template pug
// use vies
app.set('views', './views')
// add the template engine
app.set('view engine', 'pug')

app.get('/pug-template', (req, res) => {
    res.render('index', { title: 'Hey', message: 'La criatura' })
})

app.listen(port, () => {
    console.log(`aplicacion corriendo en http://127.0.0.1:${port}`)
})