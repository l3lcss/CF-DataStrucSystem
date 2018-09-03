import { db } from '../../constances'
import { authorize } from '../utils/functionAdditional'

const getAllStudents = async (req, res) => {
  const Authorization = req.get('Authorization')

  if (authorize(Authorization, res)) {
    let students = []
    let studentsList = await db.collection('member').orderBy('ID', 'asc').get()
    studentsList.forEach( async doc => {
      await students.push({
        ...doc.data()
      })
    })
    res.status(200).send({
      results: {
        success: 1,
        message: 'send students completed.',
        data: {
          students
        }
      },
      status: 200
    })
  }
}

module.exports = { getAllStudents }
