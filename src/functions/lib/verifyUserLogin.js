import { db } from '../constances'
import { authorize, hasDocument } from './utils/functionAdditional'

const verifyUserLogin = async (req, res) => {
  const { id, pass } = req.query
  const Authorization = req.get('Authorization')

  if (authorize(Authorization, res)) {
    let prepareResults = {}

    if (await hasDocument('member', id)) {
      const studentRef = await db.collection('member').doc(id).get()
      const studentDetails = studentRef.data()
      if (studentDetails.FIRST_LOGIN) {
        prepareResults = {
          results: {
            success: 1,
            message: 'Student is First Login.',
            data: {
              id,
              ...studentDetails
            }
          },
          status: 200
        }
      } else if (pass === studentDetails.password) {
        prepareResults = {
          results: {
            success: 1,
            message: `Welcome <b>${id}</b> EIEI :)`,
            data: {
              id,
              ...studentDetails
            }
          },
          status: 200
        }
      } else {
        prepareResults = {
          results: {
            success: 0,
            message: 'Invalid password.',
            data: {
              id,
              ...studentDetails
            }
          },
          status: 200
        }
      }
    } else {
      prepareResults = {
        results: {
          success: 0,
          message: `haven't Username <b>${id}</b>`,
          data: {
            id
          }
        },
        status: 200
      }
    }
    res.status(200).send(prepareResults)
  }
}

module.exports = { verifyUserLogin }
