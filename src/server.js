import express from 'express'
import fileUpload from 'express-fileupload'
import cluster from 'cluster'
import chalk from 'chalk'
import bodyParser from 'body-parser'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import routes from './routes'
import tokenChecker from './middlewares/tokenChecker'
import paramsHandler from './middlewares/paramsHandler'

const app = express()
app.use(morgan('dev'))
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }
}))
app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}))
app.use(cors())
app.use(compression())
app.use(tokenChecker)
app.use(paramsHandler)
app.use(routes)

const log = console.log
const PORT = process.env.PORT || 3000

const setupWorkerProcesses = async () => {
  const numCores = require('os').cpus().length
  const workers = []
  for (let i = 0; i < numCores; i++) {
    workers.push(cluster.fork())
    workers[i].on('message', (message) => {
      console.log(message)
    })
  }
  cluster.on('online', (worker) => {
    console.log('Worker ' + worker.process.pid + ' is listening')
  })
  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal)
    console.log('Starting a new worker')
    cluster.fork()
    workers.push(cluster.fork())
    workers[workers.length - 1].on('message', (message) => {
      console.log(message)
    })
  })
}

const setupExpress = async () => {
  app.listen(PORT, () => {
    log('\n')
    log(chalk.yellowBright(String.prototype.padStart(80, '=')))
    log(chalk.cyan(`Server Started ${ new Date() }`))
    const serverInfo = chalk.yellow(`http://localhost:${ PORT }`)
    log(chalk.green(`Application Running On: ${serverInfo}`))
    log(chalk.yellowBright(String.prototype.padStart(80, '=')))
    log('\n')
  })
}

const startServer = async () => {
  if (cluster.isMaster) {
    await setupWorkerProcesses()
  } else {
    await setupExpress()
  }
}
startServer()
