import { db } from '../../constances'
import { authorize, hasDocument } from '../utils/functionAdditional'

const getUserDetails = async (req, res) => {
  const { id } = req.query
  const Authorization = req.get('Authorization')

  if (authorize(Authorization, res)) {
    let prepareResults = {}
    if (await hasDocument('member', id)){
      const userRef = await db.collection('member').doc(id).get()
      const userDetails = userRef.data()
      prepareResults = {
        results: {
          success: 1,
          message: 'Send User Details completed.',
          data: {
            ...userDetails
          }
        },
        status: 200
      }
      res.status(200).send(prepareResults)
    } else {
      prepareResults = {
        results: {
          success: 0,
          message: 'user not found.'
        },
        status: 200
      }
      res.status(200).send(prepareResults)
    }
  }
}

module.exports = { getUserDetails }
