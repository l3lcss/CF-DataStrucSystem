import admin from 'firebase-admin'
const express = require('express')
const CORS = require('cors')({origin: true})
const app = express()
app.use(CORS)
admin.initializeApp({
    credential: admin.credential.applicationDefault() 
})

const db = admin.firestore()
const AuthorizationBase = 'iUYU4l60Ai3ZU2KtTL13wvsGwjKUVEIU'

module.exports = {
  app,
  db,
  AuthorizationBase
}
