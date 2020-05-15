const assesCompany = require('../validations/assessment')

const basedOnValidation = (data) => data.filter(item => assesCompany(item))

module.exports = {
  basedOnValidation
}