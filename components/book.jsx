import Link from "next/link";

export default function BookCard({book, children}) {
  return (
    <div className="book">
      <Link className="book_link" href={`/books/${book.id}`} >
        <div className="card">
          <div className="card_header">{book.title}</div>
          <div className="card_content">
            <img src={(book.imageUrl)} alt="本のイメージです" />
            {children}
          </div>
        </div>
      </Link>
    </div>
  );
}
