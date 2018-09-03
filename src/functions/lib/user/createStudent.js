import { db } from '../../constances'
import { hasDocument, authorize } from '../utils/functionAdditional'

const createStudent = async (req, res) => {
  const {id, name, identity} = req.body
  const Authorization = req.get('Authorization')
  let prepareResults = {}
  if (authorize(Authorization, res)) {
    if(await hasDocument('member', id)) {
      prepareResults = {
        results: {
          success: 0,
          message: 'Student ID are exists.'
        },
        status: 200
      }
    }
    else {
      const newStd = {
        ID: parseInt(id),
        name,
        FIRST_LOGIN: true,
        identity
      }
      await db.collection('member').doc(id).set(newStd)
      prepareResults = {
        results: {
          success: 1,
          message: 'create Student completed.'
        },
        status: 200
      }
    }
    res.status(200).send(prepareResults)
  }
}

module.exports = { createStudent }
