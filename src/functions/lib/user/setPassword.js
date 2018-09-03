import { db } from '../../constances'
import { authorize } from '../utils/functionAdditional'

const setPassword = async (req, res) => {
  const {id, pass} = req.body
  const Authorization = req.get('Authorization')

  if (authorize(Authorization, res)) {
    const dataResponse = await db.collection('member').doc(id).update({
      FIRST_LOGIN: false,
      password: pass 
    })
    res.status(200).send({
      results: {
        success: 1,
        message: 'set password completed.',
        data: {
          dataResponse
        }
      },
      status: 200
    })
  }
}

module.exports = { setPassword }
