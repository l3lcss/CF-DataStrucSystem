import { checkKey, db } from '../constances'

const removeVIP = (req, res) => {
  let tel = req.query.tel
  const key = req.query.key
  if (checkKey === key) {
    db.collection('vip').doc(tel).delete().then( () => {
      res.status(200).send({
        message: 'Document successfully deleted!',
        data: {
          tel,
          status: 200
        }
      })
    }).catch( (error) => {
      res.status(400).send({
        message: 'Error removing document: ', error,
        data: {
          tel,
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

module.exports = { removeVIP }
