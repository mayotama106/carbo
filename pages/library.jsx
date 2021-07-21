import Link from 'next/link'
import firebase from '@/libs/firebase'
import { useEffect, useState } from 'react';
import BookCard from '@/components/book';


function getBooks(setList) {
  const db = firebase.firestore();
  const storage = firebase.storage();
  const storageRef = storage.ref();
  let index = 0;
  const docRef = db.collection("books").orderBy("title", "asc").limit(500);
  docRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // //がぞうのURLがここで欲しい kedo 画像ない時とある時分けたい
        // indexを自前で用意する必要
        index++;
        const indexFix = index;
        const imagesRef = storageRef.child(`books/${doc.id}.jpeg`);
        console.log(doc.data().title);
        imagesRef.getDownloadURL().then(function (url) {
          console.log("iamge", doc.data().title);
          setList(prev => ([...prev, { ...doc.data(), id: doc.id, imageUrl: url, orderNum: indexFix }]));
        }).catch(_ => { //使わない変数は_で表記することが多い
          console.log("image", doc.data().title);
          setList(prev => ([...prev, { ...doc.data(), id: doc.id, imageUrl: "", orderNum: indexFix }]));
        }
        )
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

function setMyBook(bookId) {
  const db = firebase.firestore();
  const uid = firebase.auth().currentUser.uid
  const userRef = db.collection("users").doc(uid)
  userRef.update({
    // 本の情報を取得したい
    books: firebase.firestore.FieldValue.arrayUnion(bookId)
  });
}

function compareOrderNum(a, b) {
  if (a.orderNum > b.orderNum) {
    return 1;
  } else if (a.orderNum < b.orderNum) {
    return -1;
  } else {
    return 0;
  }
}

function currentUser() {
  return firebase.auth().currentUser
}


export default function Library() {
  const [list, setList] = useState([]);
  const [didMount, setDidMount] = useState(false);
  useEffect(() => {
    if (!didMount) {
      getBooks(setList);
      setDidMount(true);
    }
  });
  return (
    <div className="wrapper app_home">
      <header className="header">
        <div className="logo">
          <img src="" alt="" />
        </div>
        <nav className="g_nav">
          <div className="btns">
            <button className="login"></button>
          </div>
          <div className="user">
            <button className="user_icon">
              <img src="" alt="" />
            </button>
          </div>
        </nav>
      </header>
      <div className="main">
        <div className="books">
          {list.sort(compareOrderNum).map((book) => (
            // better key 実行時間など絶対に一意に決まるものがよし
              <BookCard book={book} key={book.id}>
                {currentUser() ? <button onClick={() => setMyBook(book.id)}>purasu</button> : null}
              </BookCard>
          ))}
        </div>
      </div>
    </div>
  )
}

