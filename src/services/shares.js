const lib = require('../lib/shares')

const fundamentusSync = async (ctx) => {
  ctx.body = await lib.fundamentusSync()
}

const goodShares = async (ctx) => {
  ctx.body = await lib.getGoodShares()
}

const allShares = async (ctx) => {
  ctx.body = await lib.getAllShares()
}


module.exports = {
  goodShares,
  allShares,
  fundamentusSync
}