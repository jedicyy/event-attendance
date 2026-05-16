import { Link } from "react-router-dom";

function Sidebar() {

  return (

    <div className="bg-slate-900 text-white w-64 min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-8">
        Smart Library
      </h1>

      <div className="space-y-4">

        <Link to="/">
          Dashboard
        </Link>

        <Link to="/books">
          Books
        </Link>

        <Link to="/borrowed">
          Borrowed
        </Link>

        <Link to="/students">
          Students
        </Link>

      </div>

    </div>
  )
}

export default Sidebar;