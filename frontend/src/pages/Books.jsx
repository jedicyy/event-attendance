function Books() {

  const books = [
    {
      title:"Python Programming",
      author:"John Doe"
    },
    {
      title:"React Development",
      author:"Jane Doe"
    }
  ]

  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-6">
        Available Books
      </h1>

      <div className="grid grid-cols-3 gap-5">

        {books.map((book,index)=>(

          <div
            key={index}
            className="bg-white p-5 rounded shadow"
          >

            <h2 className="text-2xl font-bold">
              {book.title}
            </h2>

            <p className="mb-4">
              {book.author}
            </p>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Borrow
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Books;