import { checkKey, db } from '../constances'

const getAllVIP = async (req, res) => {
  const key = req.query.key
  if (checkKey === key) {
    let vip = []
    let vipList = await db.collection('vip').get().then( QuerySnapshot => {
      QuerySnapshot.forEach( async doc => {
        let differenceDate = (new Date() - doc.data().birth_date)/(1000*3600*24*365)
        await vip.push({
          tel: doc.id,
          ...doc.data(),
          age: doc.data().age ? doc.data().age : differenceDate
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
