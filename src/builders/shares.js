const createArrayOfShares = (data) => Object.keys(data).map(item => ({
      share: item,
      ...data[item]
    }))

module.exports = {
  createArrayOfShares
}