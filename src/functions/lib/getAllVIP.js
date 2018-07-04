import { checkKey, db } from '../constances'

const getAllVIP = async (req, res) => {
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
      message: 'not authentication',
      data: {
        status: 200
      }
    })
  }
}

module.exports = { getAllVIP }
