import { db, state } from '../constances'

function validateDataInput (net) {
  return (/^\d+$/.test(net))
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

async function setNewDocumentVIP (name, birth_date, tel, gender, email) {
  let create_date = new Date()
  const newVIP = {
    birth_date: new Date(birth_date),
    create_date,
    email,
    gender,
    name,
    spending: 0
  }
  console.log(newVIP)
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

module.exports = {
  validateDataInput,
  setStatusPromoCode,
  getNewPromoCode,
  setNewDocumentPromoCode,
  setNewDocumentVIP,
  genCode,
  randomPromoCode,
  checkCode,
  checkVIP,
  setLog
}