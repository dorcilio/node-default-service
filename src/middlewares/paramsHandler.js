import { snakeCase } from 'snake-case'
const paramsHandler = (req, res, next) => {
  req.query.filter = handleString(req.query.filter)
  req.query.filtering = isFiltering(req.query.filter, false)
  req.query.sortBy = handleString(req.query.sortBy) ? snakeCase(handleString(req.query.sortBy)) : handleString(req.query.sortBy)
  req.query.direction = handleBoolean(req.query.descending, false) ? 'DESC' : 'ASC'
  req.query.limit = handleInteger(req.query.rowsPerPage, 10) ? handleInteger(req.query.rowsPerPage, 10) : 1000000000
  req.query.offset = req.query.page ? parseInt(req.query.page) - 1 : 0
  req.query.rowsNumber = req.query.rowsNumber || null
  delete req.query.descending
  delete req.query.rowsPerPage
  delete req.query.page
  return next()
}

const handleString = (value, defaultValue = null) => {
  if (value === undefined || (typeof value === 'string' && (value === 'null' || value === 'undefined'))) {
    return defaultValue
  }
  return value.trim()
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
