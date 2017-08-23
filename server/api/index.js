import { Router } from 'express'
import bodyParser from 'body-parser'
import Busboy from 'busboy'
import sharp from 'sharp'
import fs from 'fs'
import mkdirp from 'mkdirp'
import * as admin from 'firebase-admin'
import Twitter from 'twitter'
import moment from 'moment'
moment.locale('da')
const jsonParser = bodyParser.json()
const configTwitter = require('../../twitter.json')
const serviceAccount = require('../../project-1805673855421320284-firebase-adminsdk-aiu7q-fd9a9b77fb.json')
const client = new Twitter(configTwitter)
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

const removeFile = function (name) {
  return new Promise(function (resolve, reject) {
    fs.unlink(name, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

const removeImages = function (id) {
  return removeFile('static/post/raw/' + id + '.jpg').then(function () {
    return removeFile('static/post/1024/' + id + '.jpg')
  }).then(function () {
    return removeFile('static/post/512/' + id + '.jpg')
  }).then(function () {
    return removeFile('static/post/256/' + id + '.jpg')
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
  return mkdir('static/post/' + size).then(function () {
    return sharp(content).resize(size, null).toFile('static/post/' + size + '/' + key + '.jpg')
  })
}

const tweet = function (url) {
  return new Promise(function (resolve, reject) {
    client.post('statuses/update', { status: url }, function (err, tweet, response) {
      console.log(err, tweet, response)
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

const router = Router()

router.post('/post', function (req, res, next) {
  const busboy = new Busboy({ headers: req.headers })
  let inputBuffer = []
  let doc = {}
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    file.on('data', function (data) {
      inputBuffer.push(data)
    })
    file.on('end', function () {
      inputBuffer = Buffer.concat(inputBuffer)
    })
  })
  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {    
    if (fieldname === 'open') {
      doc[fieldname] = JSON.parse(val)
    } else {
      doc[fieldname] = val
    }
  })
  busboy.on('finish', function () {
    const key = firebase.database().ref('post').push().key
    writeFile('static/post/raw', key + '.jpg', inputBuffer).then(() => {
      return convert(key, inputBuffer, 256)
    }).then(() => {
      return convert(key, inputBuffer, 512)
    }).then(() => {
      return convert(key, inputBuffer, 1024)
    }).then(() => {
      doc.ts = Date.now()
      return firebase.database().ref('post').child(key).set(doc)
    }).then(function () {
      return tweet('https://elsiwhere.dk/elsiwhere/post/' + key)
    }).then(() => {
      res.status(200).end()
    }).catch((err) => {
      res.status(500).json(err)
    })
    if (doc.start && doc.stop) {
      let start = moment(doc.start, 'DD-MM-YYYY')
      let stop = moment(doc.stop, 'DD-MM-YYYY')
      if (stop.isBefore(start)) {
        let temp = start
        start = stop
        stop = temp
      }
      while (start.isSameOrBefore(stop)) {
        let day = doc.open[start.format('dddd')]
        if (day.active && day.start && day.stop) {
          firebase.database().ref('calendar').child(start.format('YYYY')).child(start.format('MM')).child(start.format('DD')).child(key).set({
            t: doc.t,
            o: day.start,
            c: day.stop
          })
        }
        start.add(1, 'd')
      }
    }
  })
  req.pipe(busboy)
})
router.post('/post/delete', jsonParser, function (req, res) {
  if (!req.body && !req.body.token && !req.body.id) {
    return res.status(400).end()
  }
  let uid
  admin.auth().verifyIdToken(req.body.token).then(function (decodedToken) {
    uid = decodedToken.uid
    return firebase.database().ref('post').child(req.body.id).once('value')
  }).then((data) => {
    let doc = data.val()
    if (doc.uid === uid) {
      return firebase.database().ref('post').child(req.body.id).remove().then(() => {
        if (doc && doc.start && doc.stop) {
          let start = moment(doc.start, 'DD-MM-YYYY')
          let stop = moment(doc.stop, 'DD-MM-YYYY')
          if (stop.isBefore(start)) {
            let temp = start
            start = stop
            stop = temp
          }
          while (start.isSameOrBefore(stop)) {
            let day = doc.open[start.format('dddd')]
            if (day.active && day.start && day.stop) {
              firebase.database().ref('calendar').child(start.format('YYYY')).child(start.format('MM')).child(start.format('DD')).child(req.body.id).remove()
            }
            start.add(1, 'd')
          }
        }
      })
    }
    return Promise.reject(new Error('user id does not match post id'))
  }).then(() => {
    return removeImages(req.body.id)
  }).then(() => {
    res.status(200).end()
  }).catch((err) => {
    res.status(500).json(err)
  })  
})
export default router
