import { db } from '../../constances'
import { authorize } from '../utils/functionAdditional'

const setReservTime = async (req, res) => {
  const {time, TA, studentID} = req.body
  const Authorization = req.get('Authorization')

  if (authorize(Authorization, res)) {
    const dataResponse = await db.collection('member').doc(studentID).update({
      schedule: {
        TA,
        time
      }
    })
    res.status(200).send({
      results: {
        success: 1,
        message: 'set setReservTime completed.',
        data: {
          dataResponse
        }
      },
      status: 200
    })
  }
}

module.exports = { setReservTime }
