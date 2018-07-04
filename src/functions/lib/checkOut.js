import { checkKey, db, state } from '../constances'
import { validateDataInput, setStatusPromoCode, getNetDiscount, setLog, getNewPromoCode } from './functionAdditional'

const checkOut = async (req, res) => {
  let {tel, net, promoCode, key} = req.query
  let raw = {
    tel: tel ? tel:'undefind',
    net,
    promoCode,
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
    let result = {}
    if(tel) {
      result = await getNewPromoCode(tel, net)
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
