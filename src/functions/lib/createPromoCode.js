import { checkKey, state } from '../constances'
import { setLog, checkCode, setNewDocumentPromoCode } from './functionAdditional'

const createPromoCode = async (req, res) => {
  const {promoCode, discountType, discountNumber, type, expDate, key} = req.query
  let raw = {
    promoCode,
    discountType,
    discountNumber,
    type,
    expDate
  }
  let result = {}
  if (checkKey === key) {
    if(await checkCode(promoCode)) {
      result = {
        message: 'Promotion Code are exists',
        data: {
          status: 400
        }
      }
      res.status(400).send(result)
      return
    }
    else {
      setNewDocumentPromoCode(promoCode, discountType, discountNumber, type, expDate)
      result = {
        message: 'create promotion code completed',
        data: {
          status: 200
        }
      }
      res.status(200).send(result)
    }
  } else {
    result = {
      message: 'not authentication',
      data: {
        status: 200
      }
    }
    res.status(200).send(result)
  }
  setLog(raw, state.CREATE_PROMOCODE, result)
}

module.exports = { createPromoCode }
