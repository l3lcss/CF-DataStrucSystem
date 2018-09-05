const { getUserDetails } = require('./getUserDetails')
const { setPassword } = require('./setPassword')
const { verifyUserLogin } = require('./verifyUserLogin')
const { getAllStudents } = require('./getAllStudents')
const { createStudent } = require('./createStudent')
const { removeStudent } = require('./removeStudent')
const { setReservTime } = require('./setReservTime')

module.exports = {
  getUserDetails,
  setPassword,
  verifyUserLogin,
  getAllStudents,
  createStudent,
  removeStudent,
  setReservTime
}
