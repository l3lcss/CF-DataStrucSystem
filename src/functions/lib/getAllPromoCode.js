import { checkKey, db } from '../constances'

const getAllPromoCode = async (req, res) => {
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
      message: 'not authentication',
      data: {
        status: 200
      }
    })
  }
}

module.exports = { getAllPromoCode }
