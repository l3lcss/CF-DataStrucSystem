import * as functions from 'firebase-functions'
import { app } from './constances'

const { getstudentDetails } = require('./lib/getstudentDetails')
const { setPassword } = require('./lib/setPassword')

app.get('/getstudentDetails', getstudentDetails)
app.get('/setPassword', setPassword)

exports.app = functions.https.onRequest(app)
