import { db } from '../../constances'
import { authorize } from '../utils/functionAdditional'

const removeStudent = async (req, res) => {
  const { id } = req.query
  const Authorization = req.get('Authorization')
  if (authorize(Authorization, res)) {
    const respone = await db.collection('member').doc(id).delete()
    const prepareResults = {
      results: {
        success: 1,
        message: 'success!',
        data: {
          id
        },
        removeTime: JSON.stringify(respone)
      },
      status: 200
    }
    res.status(200).send(prepareResults)
  }
}

module.exports = { removeStudent }
