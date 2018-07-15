import { db } from '../constances'

const getstudentDetails = async (req, res) => {
  let studentID = req.query.id
    const studentList = await db.collection('member').doc(studentID).get()
    let resStudentList = studentList.data()
    if ( resStudentList === undefined) {
      res.status(404).send({
        message: 'students not found',
        data: {
          status: 404
        }
      })
    } else {
      res.status(200).send({
        message: 'send studentDetails complete',
        data: {
          status: 200,
          studentID,
          ...resStudentList
        }
      })
    }
}

module.exports = { getstudentDetails }
