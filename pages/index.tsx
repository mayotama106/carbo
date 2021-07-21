import Link from 'next/link';
import firebase from '@/libs/firebase';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { set } from '@/slices/user';
import { useDispatch, useSelector } from 'react-redux';



function googleLogin() {
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    console.log(result.user);
    Router.push("/library");
  }).catch((error) => {
  });
}

function logout() {
  firebase.auth().signOut()
  .then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  
}

function fetchUser(dispatcher){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      dispatcher(set({uid: user.uid, name: user.displayName, icon: user.photoURL}));
    }
  });
}


export default function Home() {
  const dispatcher = useDispatch();
  const user = useSelector((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    fetchUser(dispatcher);
  }, [])
  useEffect(() => {
    if(user) {
      router.push("/bookshelf");
    }
  }, [user])
  return (
    <div>
      <button onClick= {googleLogin}>google login</button>
      <button onClick= {logout}>logout</button>
    </div>
  )
}
