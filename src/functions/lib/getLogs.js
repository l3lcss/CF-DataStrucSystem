import { checkKey, db } from '../constances'

const getLogs = async (req, res) => {
  const key = req.query.key
  if (checkKey === key) {
    let logs = []
    let logsList = await db.collection('logs').get().then( QuerySnapshot => {
      QuerySnapshot.forEach( async doc => {
        await logs.push({
          ...doc.data()
        })
      })
    })
    res.status(200).send({
      message: 'send logs complete',
      data: {
        status: 200,
        logs
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

module.exports = { getLogs }
