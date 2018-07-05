import { checkKey, state } from '../constances'
import { setLog, checkVIP, setNewDocumentVIP } from './functionAdditional'

const createVIPAccount = async (req, res) => {
  const {name, birth_date, tel, gender, email, key} = req.query
  let raw = {
    name,
    birth_date,
    tel,
    gender,
    email
  }
  let result = {}
  if (checkKey === key) {
    if(await checkVIP(tel)) {
      result = {
        message: 'Tel VIP are exists',
        data: {
          status: 400
        }
      }
      res.status(400).send(result)
      return
    }
    else {
      setNewDocumentVIP(name, birth_date, tel, gender, email)
      result = {
        message: 'create VIP tel completed',
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
  setLog(raw, state.CREATE_VIP, result)
}

module.exports = { createVIPAccount }
