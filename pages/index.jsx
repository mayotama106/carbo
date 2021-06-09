import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import firebase from '@/libs/firebase'


function googleLogin() {
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    console.log(result.user);
  }).catch((error) => {
  });
}

export default function Home() {
  return (
    <div>
      <header><Link href="login">ログイン</Link></header>
      <button onClick= {googleLogin}>google login</button>
    </div>
  )
}
