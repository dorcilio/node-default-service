import snakeCase from 'snake-case'
const paramsHandler = (req, res, next) => {
  req.query.filter = req.query.filter || null
  req.query.filtering = isFiltering(req.query.filter, false)
  req.query.sortBy = req.query.sortBy && req.query.sortBy !== 'null' && req.query.sortBy !== 'undefined' ? snakeCase(req.query.sortBy) : null
  req.query.direction = handleBoolean(req.query.descending, false) ? 'DESC' : 'ASC'
  req.query.limit = handleInteger(req.query.rowsPerPage, 10) ? handleInteger(req.query.rowsPerPage, 10) : 1000000000
  req.query.offset = req.query.page ? parseInt(req.query.page) - 1 : 0
  req.query.rowsNumber = req.query.rowsNumber || null
  delete req.query.descending
  delete req.query.rowsPerPage
  delete req.query.page
  return next()
}

const handleInteger = (value, defaultValue) => {
  if (value) {
    return parseInt(value)
  }
  return defaultValue
}

const isFiltering = (value, defaultValue) => {
  if (value) {
    return value !== 'null'
  }
  return defaultValue
}

const handleBoolean = (value, defaultValue) => {
  if (value) {
    return value === true || value === 'true'
  }
  return defaultValue
}

export default paramsHandler
