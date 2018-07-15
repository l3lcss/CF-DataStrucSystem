import { db } from '../constances'

const setPassword = (req, res) => {
  let {id, pass} = req.query
  db.collection('member').doc(id).update({ password:pass }).then((result) => {
    console.log(result)
    res.status(200).send({
      message: 'set password complete',
      data: {
        status: 200
      }
    })
  }).catch((err) => {
    console.log('error = ', err)
  })
}

module.exports = { setPassword }
