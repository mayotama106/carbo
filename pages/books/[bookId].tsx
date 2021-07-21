import { useRouter } from 'next/router';
import  Link from 'next/link';
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

const Books = () => {
  const router = useRouter();
  const [sectionList, setSectionList] = useState<SectionData[]>([]);
  const [data, setData] = useState<bookData>(null);
  const { bookId } = router.query;
  const [didMount, setDidMount] = useState(false);
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
      {data ? <p className="title">{data.title}</p> : null}
      <ul className="sections">
        {sectionList.map((section) => {
          return (<li className="section">
            <p className="title">
            <Link href={`/books/${bookId}/sections/${section.id}`}>
              <div className="section_container">
              <span>{section.sec_num}</span>
              {section.title}
              </div>
            </Link>
            </p>
          </li>)
        })} 
      </ul>
    </div>
  </div>
  )
};

export default Books;