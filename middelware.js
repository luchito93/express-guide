const middLog = (options = {text: new Date().toISOString()}) => {
    return (req, res, next) => {
        console.log('LOG WITH ', options.text)
        next()
    }
}

const addReqTime = (req, res, next) => {
    req.requestTime = new Date().toISOString().slice(0, 22).replace('T', ' ')
    next()
}

//star cookie validator
const _validateCookieServise = (testCookie) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (testCookie === 'luchin') {
                resolve()
            } else {
                reject(new Error('la cookie no es valida'))
            }
        }, 2000);
    })
}

const validateCookiesMidd = async (req, res, next) => {
    try {
        await _validateCookieServise(req?.cookies?.testCookie)
        next()
    } catch (error) {
        next(error)
    }
}

//end cookie validator

// Error handler middleware
const errHandlerMidd = (err, req, res, next) => {
    res.status(400).send(`message from error handler: ${err.message}`)
}

module.exports = {
    middLog,
    addReqTime,
    validateCookiesMidd,
    errHandlerMidd
}