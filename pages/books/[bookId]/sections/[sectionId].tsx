import { useRouter } from 'next/router';
import firebase from '@/libs/firebase';
import { useEffect, useState } from 'react';
import React from 'react';

type SectionData = {
  id: string;
  sec_num: number;
  title: string;
}


function getSection(bookId:string, sectionId:string, setData: (data:SectionData) => void) : void  {
  console.log("do");
  const db = firebase.firestore();
  const docRef = db.collection("books").doc(bookId).collection("sections").doc(sectionId);
  docRef
  .get()
  .then((doc) => {
    if (doc.exists) {
        setData({
          id: sectionId,
          sec_num: doc.data().sec_num,
          title: doc.data().title
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



const Sections = () => {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [data, setData] = useState<SectionData>(null);
  const { bookId, sectionId } = router.query;
  const [didMount, setDidMount] = useState(false);
  //useEffectはレンダリン後に実行される
  //N回副作用を実行したい時は第２引数の出番 https://ja.reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    if (!didMount && bookId) {
      // console.log(router.query);
      getSection(bookId as string, sectionId as string, setData);
      setDidMount(true);
    }
  });

  return (
  <div className="wrapper book">
    <div className="main">
      {
       data ? <p className="title">{data.title}</p> : <p>now loading</p>
      }
      <ul className="questions">
        {list.map((section, index) => {
          return (<li className="question">
            <p className="title">
              <span>{index}</span>
              {section.title}
            </p>
          </li>)
        })} 
      </ul>
    </div>
  </div>
  )
};

export default Sections;