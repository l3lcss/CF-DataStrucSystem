import { checkKey, db } from '../constances'

const removePromoCode = (req, res) => {
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
      message: 'not authentication',
      data: {
        status: 200
      }
    })
  }
}

module.exports = { removePromoCode }
