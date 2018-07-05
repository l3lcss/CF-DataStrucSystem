import { checkKey, db } from '../constances'

const removePromoCode = (req, res) => {
  let promoCode = req.query.promoCode
  const key = req.query.key
  if (checkKey === key) {
    db.collection('promoCode').doc(promoCode).delete().then( () => {
      res.status(200).send({
        message: 'success!',
        data: {
          promoCode,
          status: 200
        }
      })
    })
  } else {
    res.status(200).send({
      message: 'not authentication',
      data: {
        status: 200
      }
    })
  }
}

module.exports = { removePromoCode }
