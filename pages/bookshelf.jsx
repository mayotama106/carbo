import Link from 'next/link'
import firebase from '@/libs/firebase'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function getBooks(setList, user) {
  const db = firebase.firestore();  
  const docRef = db.collection("users").doc(user.uid);
  docRef
  .get()
  .then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        db.collection("books").where(firebase.firestore.FieldPath.documentId() , "in", doc.data().books)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              setList(prev => ([...prev, {...doc.data(), id:doc.id}]));
          });
      })
      .catch((error) => {
          console.log("Error getting document: ", error);
      });
    } else {
        // doc.data() will be undefined in this case
    // doc.data() will be undefined in this case
    console.log("No such document!");
    }
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });

}

export default function Bookshelf() {
  const [list, setList] = useState([]);
  const [didMount,setDidMount] = useState(false);
  const user = useSelector(state => state.user);
  useEffect(() => {
    if(!didMount && user){
      getBooks(setList, user);
      setDidMount(true);
    }
  });
  if (user){
    return(
      <div>
        <header><Link href="/">ログイン</Link></header>
        <h1>ほんだな</h1>
        <ul>
          {list.map((book) => (
            <li><Link href={`/myBooks/${book.id}`}>{book.title}</Link></li>
          ))}
        </ul>
      </div>
    )
  }else{
    return <div>user null</div>
  }
  }

