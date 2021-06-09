import firebase from 'firebase'
import firebaseConfig from '@/firebase.config.json'

firebase.initializeApp(firebaseConfig);

export default firebase;