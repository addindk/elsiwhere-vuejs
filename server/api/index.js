import { Router } from 'express'
import Busboy from 'busboy'
import sharp from 'sharp'
import fs from 'fs'
import mkdirp from 'mkdirp'
import * as admin from 'firebase-admin'

var serviceAccount = require('../../project-1805673855421320284-firebase-adminsdk-aiu7q-fd9a9b77fb.json')

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://project-1805673855421320284.firebaseio.com'
})

const mkdir = function (p) {
  return new Promise(function (resolve, reject) {
    mkdirp(p, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

const writeFile = function (p, name, content) {
  return mkdir(p).then(function () {
    return new Promise(function (resolve, reject) {
      fs.writeFile(p + '/' + name, content, function (err, success) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })
}

const convert = function (key, content, size) {
  return mkdir('images/post/' + size).then(function () {
    return sharp(content).resize(size, null).toFile('images/post/' + size + '/' + key + '.webp')
  })
}

const router = Router()

router.post('/post', function (req, res, next) {
  const busboy = new Busboy({ headers: req.headers })
  let inputBuffer = []
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype)
    file.on('data', function (data) {
      inputBuffer.push(data)
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes')
    })
    file.on('end', function () {
      inputBuffer = Buffer.concat(inputBuffer)
      console.log('File [' + fieldname + '] Finished')
    })
  })
  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + val)
  })
  busboy.on('finish', function () {
    console.log('Done parsing form!')
    const key = firebase.database().ref('post').push().key
    writeFile('images/post/raw', key + '.jpg', inputBuffer).then(() => {
      return convert(key, inputBuffer, 256)
    }).then(() => {
      return convert(key, inputBuffer, 512)
    }).then(() => {
      return convert(key, inputBuffer, 1024)
    }).then(() => {
      res.status(200).end()
    }).catch((err) => {
      res.status(500).json(err)
    })
  })
  req.pipe(busboy)
})

export default router
