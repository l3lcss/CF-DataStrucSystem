import { checkKey, db, state } from '../constances'
import { validateDataInput, setStatusPromoCode, setLog, getNewPromoCode } from './functionAdditional'

const checkOut = async (req, res) => {
  let {tel, net, promoCode, key, billID} = req.query
  let raw = {
    tel: tel ? tel :'undefind',
    net,
    promoCode,
    billID: billID ? billID : 'undefind',
    key
  }
  if (checkKey === key) {
    if (!validateDataInput(net)) {
      res.status(400).send({
        message: 'net should be numeric',
        data: {
          status: 400
        }
      })
      return
    }
    if (promoCode) {
      await db.runTransaction(transaction => {
        return transaction.get(db.collection('promoCode').doc(promoCode))
        .then (async selectedPromotion => {
          if (selectedPromotion.exists && selectedPromotion.data().status === 'unused' && (selectedPromotion.data().exp_date > new Date())) {
            setStatusPromoCode(selectedPromotion.data().type, promoCode)
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
    let result = {}
    if(tel) {
      result = await getNewPromoCode(tel, net)
      await db.collection('vip').doc(tel).get().then( QuerySnapshot => {
        console.log(QuerySnapshot.data().spending)
      })
    } else {
      result = {netDiscount: net}
    }
    res.send(result)
  } else {
    res.status(200).send({
      message: 'not authentication',
      data: {
        status: 200
      }
    })
  }
}

module.exports = { checkOut }
