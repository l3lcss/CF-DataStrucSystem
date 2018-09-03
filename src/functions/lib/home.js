const home = (req, res) => {
  res.send('GW BackEnd : ' + new Date())
}

module.exports = { home }
