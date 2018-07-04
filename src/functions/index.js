import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
const express = require('express')
const CORS = require('cors')({origin: true})
const app = express()
app.use(CORS)
admin.initializeApp({
    credential: admin.credential.applicationDefault() 
})

const { getDiscount } = require('./lib/getDiscount')
const { checkOut } = require('./lib/checkOut')
const { createPromoCode } = require('./lib/createPromoCode')
const { createVIPAccount } = require('./lib/createVIPAccount')
const { getAllPromoCode } = require('./lib/getAllPromoCode')
const { getAllVIP } = require('./lib/getAllVIP')
const { removePromoCode } = require('./lib/removePromoCode')
const { removeVIP } = require('./lib/removeVIP')
const { getLogs } = require('./lib/getLogs')

app.get('/getDiscount', getDiscount)
app.get('/checkOut', checkOut)
app.get('/createPromoCode', createPromoCode)
app.get('/createVIPAccount', createVIPAccount)
app.get('/getAllPromoCode', getAllPromoCode)
app.get('/getAllVIP', getAllVIP)
app.get('/removePromoCode', removePromoCode)
app.get('/removeVIP', removeVIP)
app.get('/getLogs', getLogs)

exports.app = functions.https.onRequest(app)
