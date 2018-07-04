import { checkKey, db, state } from '../constances'
import { setLog } from './functionAdditional'

const getDiscount = async (req, res) => {
  const promoCode = req.query.promoCode
  const key = req.query.key
  let raw = {
    promoCode,
    key
  }
  // console.log(raw)
  // console.log('checkKey = ', checkKey)
  if (checkKey === key) {
    const promotionDetails = await db.collection('promoCode').doc(promoCode).get()
    // console.log('db = ', promotionDetails.exists)
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
      message: 'not authentication',
      data: {
        status: 200
      }
    })
  }
}

module.exports = { getDiscount }
