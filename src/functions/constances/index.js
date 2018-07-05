import admin from 'firebase-admin'
const express = require('express')
const CORS = require('cors')({origin: true})
const app = express()
app.use(CORS)
admin.initializeApp({
    credential: admin.credential.applicationDefault() 
})
const db = admin.firestore()

const checkKey = '4784d051-dce8-4918-a0b1-9b429a23f8d6'
const state = {      
  GEN_CODE: 'GEN_CODE',
  FIND_CODE: 'FIND_CODE',
  USE_CODE: 'USE_CODE',
  VALIDATE_DATA: 'VALIDATE_DATA',
  CREATE_PROMOCODE: 'CREATE_PROMOCODE',
  CREATE_VIP: 'CREATE_VIP'
}

module.exports = {
  app,
  db,
  checkKey,
  state
}
