import { useRouter } from 'next/router';
import firebase from '@/libs/firebase';
import { useEffect, useState } from 'react';
import React from 'react';
import Router from 'next/router';


type bookData = {
  id: string,
  title: string
}

function getBook(bookId:string, setData:(data:bookData) => void) : void{
  const db = firebase.firestore();
  const docRef = db.collection("books").doc(bookId);
  docRef
  .get()
  .then((doc) => {
    if (doc.exists) {
      // console.log(doc.get("title"))
        setData({
          id: bookId,
          title: doc.data().title
        });
    } else {
        // doc.data() will be undefined in this case
    // doc.data() will be undefined in this case
    // console.log("No such document!");
    }
  })
  .catch((error) => {
      // console.log("Error getting documents: ", error);
  });
}

async function startStudy(bookId){
  const userId = firebase.auth().currentUser.uid;
  //studyTimeドキュメントの作成
  const db = firebase.firestore();
  const studyTimesRef = db.collection("users").doc(userId).collection("myBooks").doc(bookId).collection("stydyTime");
  const studyTimes =  await studyTimesRef.get();
  const sectionsRef = db.collection("books").doc(bookId).collection("sections");
  const sections = await sectionsRef.get()
  const currentStudyRef = await studyTimesRef.add({
    done_num: studyTimes.docs.length + 1,　// 現在のドキュメントの数　＋１
    startTime: new Date(), //  始めるボタンのonClickイベント開始時刻
    sectionId: sections.docs[Math.floor(Math.random()*sections.docs.length)].ref //bookIdからbooks/{bookId}/sections/sectionsのランダム番目
  })
  const userRef = db.collection("users").doc(userId);
  await userRef.update("currentStudy", currentStudyRef);
  Router.push("/studying");
}

const Books = () => {
  const router = useRouter();
  const [data, setData] = useState<bookData>(null);
  const { bookId } = router.query;
  const [didMount, setDidMount] = useState(false);
  //useEffectはレンダリン後に実行される
  //N回副作用を実行したい時は第２引数の出番 https://ja.reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    if (!didMount && bookId) {
      // console.log(router.query);
      getBook(bookId as string, setData);
      setDidMount(true);
    }
  });
  return (
  <div className="wrapper book">
    <div className="main">
      {data ? <p className="title">{data.title}</p> : null}
      <button onClick={() => startStudy(bookId)}>始める</button>
    </div>
  </div>
  )
};

export default Books;

