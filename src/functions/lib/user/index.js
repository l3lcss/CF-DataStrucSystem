const { getstudentDetails } = require('./getstudentDetails')
const { setPassword } = require('./setPassword')
const { verifyUserLogin } = require('./verifyUserLogin')
const { getAllStudents } = require('./getAllStudents')
const { createStudent } = require('./createStudent')
const { removeStudent } = require('./removeStudent')

module.exports = {
  getstudentDetails,
  setPassword,
  verifyUserLogin,
  getAllStudents,
  createStudent,
  removeStudent
}
