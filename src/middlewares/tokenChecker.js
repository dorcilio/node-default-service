const PRODUCTION_MODE = process.env.PRODUCTION

const tokenChecker = async (req, res, next) => {
  if (PRODUCTION_MODE) {
    return next()
  } else {
    return next()
  }
}

export default tokenChecker
