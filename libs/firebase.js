import firebase from 'firebase'
import firebaseConfig from '@/firebase.config.json'


if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;