import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import { QuerySnapshot } from '@google-cloud/firestore'
const express = require('express')
const CORS = require('cors')({origin: true})
const app = express()
app.use(CORS)
admin.initializeApp({
    credential: admin.credential.applicationDefault() 
})
const state = {     
  GEN_CODE: 'GEN_CODE',
  FIND_CODE: 'FIND_CODE',
  USE_CODE: 'USE_CODE',
  VALIDATE_DATA: 'VALIDATE_DATA'
}

const db = admin.firestore()
const checkKey = '4784d051-dce8-4918-a0b1-9b429a23f8d6'

app.get('/getDiscount', async (req, res) => {
  const promoCode = req.query.promoCode
  const key = req.query.key
  let raw = {
    promoCode,
    key
  }
  if (checkKey === key) {
    const promotionDetails = await db.collection('promoCode').doc(promoCode).get()
    if (promotionDetails.exists) {
      let promotionData = promotionDetails.data()
      setLog(raw, state.FIND_CODE, promotionData)
      res.send({
        ...promotionData,
        promoCode
      })
    } else {
      setLog(raw, state.FIND_CODE, null)
      res.status(200).send({
        message: 'promotionCode not found'
      })
    }
  } else {
    res.status(200).send({
      message: 'not authentication'
    })
  }
})

app.get('/checkOut', async (req, res) => {
  let {tel, net, promoCode, key} = req.query
  let raw = {
    tel,
    net,
    promoCode,
    key
  }
  if (checkKey === key) {
    if (!validateDataInput(tel, net)) {
      res.status(400).send({
        message: 'tel and net should be numeric',
        data: {
          status: 400
        }
      })
      return
    }
    if (promoCode) {
      const promotion = await db.runTransaction(transaction => {
        return transaction.get(db.collection('promoCode').doc(promoCode))
        .then (async selectedPromotion => {
          if (selectedPromotion.exists && selectedPromotion.data().status === 'unused' && (selectedPromotion.data().exp_date > new Date())) {
            setStatusPromoCode(selectedPromotion.data().type, promoCode)
            net = await getNetDiscount ( 
              net,
              selectedPromotion.data().discount_type,
              selectedPromotion.data().discount_number
            )
            setLog(raw, state.USE_CODE, net)
          } else {
            setLog(raw, state.USE_CODE, net)
          }
        })
      }).then(() => {
        console.log('Transaction used code success')
      }).catch(err => {
        console.error(err)
      })
    }
    const result = await getNewPromoCode(tel, net)
    res.send(result)
  } else {
    res.status(200).send({
      message: 'not authentication'
    })
  }
})

app.get('/createPromoCode', async (req, res) => {
  const {promoCode, discountType, discountNumber, type, expDate, key} = req.query
  if (checkKey === key) {
    if(await checkCode(promoCode)) {
      res.status(400).send({
        message: 'Promotion Code are exists',
        data: {
          status: 400
        }
      })
      return
    }
    else {
      setNewDocumentPromoCode(promoCode, discountType, discountNumber, type, expDate)
      res.status(200).send({
        message: 'create promotion code completed',
        data: {
          status: 200
        }
      })
    }
  } else {
    res.status(200).send({
      message: 'not authentication'
    })
  }
})

app.get('/createVIPAccount', async (req, res) => {
  const {name, age, tel, gender, email, key} = req.query
  if (checkKey === key) {
    if(await checkVIP(tel)) {
      res.status(400).send({
        message: 'Tel VIP are exists',
        data: {
          status: 400
        }
      })
      return
    }
    else {
      setNewDocumentVIP(name, age, tel, gender, email)
      res.status(200).send({
        message: 'create VIP tel completed',
        data: {
          status: 200
        }
      })
    }
  } else {
    res.status(200).send({
      message: 'not authentication'
    })
  }
})

app.get('/getAllPromoCode', async (req, res) => {
  const key = req.query.key
  if (checkKey === key) {
    let promoCode = []
    let promoCodeList = await db.collection('promoCode').get().then( QuerySnapshot => {
      QuerySnapshot.forEach( async doc => {
        await promoCode.push({
          promoCode: doc.id,
          ...doc.data()
        })
      })
    })
    res.status(200).send({
      message: 'send promoCode complete',
      data: {
        status: 200,
        promoCode
      }
    })
  } else {
    res.status(200).send({
      message: 'not authentication'
    })
  }
})

app.get('/getAllVIP', async (req, res) => {
  const key = req.query.key
  if (checkKey === key) {
    let vip = []
    let vipList = await db.collection('vip').get().then( QuerySnapshot => {
      QuerySnapshot.forEach( async doc => {
        await vip.push({
          tel: doc.id,
          ...doc.data()
        })
      })
    })
    res.status(200).send({
      message: 'send VIP complete',
      data: {
        status: 200,
        vip
      }
    })
  } else {
    res.status(200).send({
      message: 'not authentication'
    })
  }
})

app.get('/removePromoCode', (req, res) => {
  let promoCode = req.query.promoCode
  const key = req.query.key
  if (checkKey === key) {
    db.collection('promoCode').doc(promoCode).delete().then( () => {
      res.status(200).send({
        message: 'Document successfully deleted!',
        data: {
          promoCode,
          status: 200
        }
      })
    }).catch( (error) => {
      res.status(400).send({
        message: 'Error removing document: ', error,
        data: {
          promoCode,
          status: 400
        }
      })
    })
  } else {
    res.status(200).send({
      message: 'not authentication'
    })
  }
})

app.get('/removeVIP', (req, res) => {
  let tel = req.query.tel
  const key = req.query.key
  if (checkKey === key) {
    db.collection('vip').doc(tel).delete().then( () => {
      res.status(200).send({
        message: 'Document successfully deleted!',
        data: {
          tel,
          status: 200
        }
      })
    }).catch( (error) => {
      res.status(400).send({
        message: 'Error removing document: ', error,
        data: {
          tel,
          status: 400
        }
      })
    })
  } else {
    res.status(200).send({
      message: 'not authentication'
    })
  }
})

function getNetDiscount (net, discountType, discountNumber) { 
  const discountNumberInt = parseInt(discountNumber)
  if (discountType === 'amount') {
    net = net - discountNumberInt
  } else if (discountType === 'percent') {
    net = net - ((net * discountNumberInt) / 100)
  }
  if (net < 0) {
    net = 0
  }
  return net.toString()
}

function validateDataInput (tel, net) {
  if (!((tel) && (net)) || !(/^\d+$/.test(net))) {
    return false
  } else {
    return true
  }
}

function setStatusPromoCode (type, promoCode) {
  if (type === 'onetime') {
    db.collection('promoCode').doc(promoCode).update({
      status: 'used'
    })
  }
}

async function getNewPromoCode (tel, net) {
  let raw = {
    tel,
    net
  }
  let discount_number = '300'
  let discount_type = 'amount'
  let type = 'onetime'
  const vip = await db.collection('vip').doc(tel).get()
  if (vip.exists && net >= 3000) {
    let generatedCode = await genCode()
    const promotionDocument = await db.runTransaction(transaction => {
      return transaction.get(db.collection('promoCode').doc(generatedCode))
        .then (async totalPromotionCode => {
          if (!totalPromotionCode.exists) {
            setNewDocumentPromoCode (generatedCode, discount_type, discount_number, type)
            setLog(raw, state.GEN_CODE, { newGenerateCode : generatedCode, netDiscount : net})
          }
      })
    })
    return ({ newGenerateCode : generatedCode, netDiscount : net})
  } else {
    setLog(raw, state.GEN_CODE, { newGenerateCode : null, netDiscount : net})
    return ({netDiscount: net})
  }
}

async function setNewDocumentPromoCode (generatedCode, discount_type, discount_number, type, expDate) {
  let createDate = new Date()
  if ( expDate ===  undefined ) {
    expDate = new Date(createDate.getFullYear(), createDate.getMonth()+3, createDate.getDate(), createDate.getHours(), createDate.getMinutes(), createDate.getSeconds())
  } else {
    expDate = new Date(expDate.substring(0, 4), parseInt(expDate.substring(5, 7), 10)-1, parseInt(expDate.substring(8, 10), 10)+1)
  }
  const newCode = {
    create_date: createDate,
    discount_number,
    discount_type,
    exp_date: expDate,
    status: 'unused',
    type
  }
  await db.collection('promoCode').doc(generatedCode).set(newCode)
}

async function setNewDocumentVIP (name, age, tel, gender, email) {
  let create_date = new Date()
  const newVIP = {
    age,
    create_date,
    email,
    gender,
    name,
    spending: 0
  }
  await db.collection('vip').doc(tel).set(newVIP)
}

async function genCode() { 
  let code
  const message = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
  do {
    code = randomPromoCode (message)
  } while (await checkCode(code))
  return code
} 

function randomPromoCode (message) {
  let code = ''
    for (let i = 0; i < 5; i++) {
      code += message.charAt(Math.floor(Math.random() * message.length))
    }
  return code
}

async function checkCode (code) {
  const hasPromocode = await db.collection('promoCode').doc(code).get()
  return hasPromocode.exists
}

async function checkVIP (tel) {
  const hasVIP = await db.collection('vip').doc(tel).get()
  return hasVIP.exists
}

function setLog (raw, state, result) {
  db.collection('logs').add({
    time: new Date(),
    state: state,
    result: result,
    raw: raw
  })
}

exports.app = functions.https.onRequest(app)
