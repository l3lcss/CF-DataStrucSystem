import * as functions from 'firebase-functions'
import { app } from './constances'

const { getstudentDetails } = require('./lib/getstudentDetails')
const { setPassword } = require('./lib/setPassword')
const { verifyUserLogin } = require('./lib/verifyUserLogin')

app.get('/getstudentDetails', getstudentDetails)
app.get('/verifyUserLogin', verifyUserLogin)
app.post('/setPassword', setPassword)

exports.app = functions.https.onRequest(app)
