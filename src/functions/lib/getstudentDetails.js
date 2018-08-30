import { db } from '../constances'
import { authorize, hasDocument } from './utils/functionAdditional'

const getstudentDetails = async (req, res) => {
  const { id } = req.query
  const Authorization = req.get('Authorization')

  if (authorize(Authorization, res)) {
    let prepareResults = {}
    if (await hasDocument('member', id)){
      const studentRef = await db.collection('member').doc(id).get()
      const StudentDetails = studentRef.data()
      prepareResults = {
        results: {
          success: 1,
          message: 'Send Student Details completed.',
          data: {
            studentID: id,
            ...StudentDetails
          }
        },
        status: 200
      }
      res.status(200).send(prepareResults)
    } else {
      prepareResults = {
        results: {
          success: 0,
          message: 'students not found.'
        },
        status: 200
      }
      res.status(200).send(prepareResults)
    }
  }
}

module.exports = { getstudentDetails }
