import * as firebase from 'firebase'
// import 'firebase/database'
// import 'firebase/auth'
const config = {
  apiKey: 'AIzaSyCByuBNKnBU64oik_Z0qEKgi_czpEN9aL8',
  authDomain: 'project-1805673855421320284.firebaseapp.com',
  databaseURL: 'https://project-1805673855421320284.firebaseio.com',
  storageBucket: 'project-1805673855421320284.appspot.com',
  messagingSenderId: '95401772779'
}
firebase.database.enableLogging(false, true)
let firebaseapp
try {
  firebaseapp = firebase.app()
} catch (error) {
  firebaseapp = firebase.initializeApp(config)
}

const providers = {
  facebook: new firebase.auth.FacebookAuthProvider(),
  google: new firebase.auth.GoogleAuthProvider(),
  twitter: new firebase.auth.TwitterAuthProvider(),
  email: new firebase.auth.EmailAuthProvider()
}
const uiConfig = {
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccess: function (currentUser, credential, redirectUrl) {
      // Do something.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return false
    }
  },
  signInFlow: 'redirect' // popup'
}
export { firebaseapp, providers, uiConfig }
