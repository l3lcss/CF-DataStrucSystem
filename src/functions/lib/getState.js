import { checkKey, state } from '../constances'

const getState = async (req, res) => {
  const key = req.query.key
  if (checkKey === key) {
    let stateArray= []
    for (var arr in state) {
      stateArray.push(arr)
    }
    res.status(200).send({
      message: 'send states complete',
      data: {
        status: 200,
        stateArray
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

module.exports = { getState }
