import { useRouter } from 'next/router';
import Router from 'next/router';
import firebase from '@/libs/firebase';
import { useEffect, useState } from 'react';
import React from 'react';


type bookData = {
  id: string,
  title: string
}

type SectionData = {
  id: string;
  sec_num: number;
  title: string;
}

function currentUser() {
  return firebase.auth().currentUser.uid;
}

function getBook(bookId:string, setData:(data:bookData) => void, setList: React.Dispatch<React.SetStateAction<SectionData[]>>) : void{
  const db = firebase.firestore();
  const docRef = db.collection("books").doc(bookId);
  docRef
  .get()
  .then((doc) => {
    if (doc.exists) {
      console.log(doc.get("title"))
        setData({
          id: bookId,
          title: doc.data().title
        });
        docRef.collection("sections")
        .get()
        .then((collection) => {
          console.log(collection.docs.forEach((c) => {
            console.log(c.data());
            const data = c.data()
            setList(prev => [...prev, {id: c.id, sec_num: data.sec_num, title: data.title}]);
          }));
        })
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


async function finishStudy(userId){
  const db = firebase.firestore();
  // userのカレントスタディのreferenceを取得
  const user = await db.collection("users").doc(userId).get();
  const currentStudyRef = user.get("currentStudy");
  // finishTimeを追加
  await currentStudyRef.update("finishTime" , new Date())
  const userRef = db.collection("users").doc(userId);
  // カレントスタディをnullにする
  Router.push("/studyingResult");  
}


const Studying = () => {
  const router = useRouter();
  const [sectionList, setSectionList] = useState<SectionData[]>([]);
  const [data, setData] = useState<bookData>(null);
  const { bookId } = router.query;
  const [didMount, setDidMount] = useState(false);
  const userId = currentUser()
  //useEffectはレンダリン後に実行される
  //N回副作用を実行したい時は第２引数の出番 https://ja.reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    if (!didMount && bookId) {
      console.log(router.query);
      getBook(bookId as string, setData, setSectionList);
      setDidMount(true);
    }
  });
  return (
  <div className="wrapper book">
    <div className="main">
      {data ? <p className="title">{data.title}をやりましょう</p> : null}
      <button className="finishStudy" onClick={() => finishStudy(userId)}>完了！</button>
    </div>
  </div>
  )
};

export default Studying;