import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitUI from "../components/RateLimitUI";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";
import { Link } from "react-router";
import { NotebookIcon } from "lucide-react";
import LoadingSpin from "../components/LoadingSpin";

const HomePage = () => {
  const [isRateLimited, setRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setRateLimited(false); 
      } catch (error) {
        console.log("Error fetching notes");
        if (error.response?.status == 429) {
          setRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      }
      finally{
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">

        {loading && <LoadingSpin />}

        {notes.length === 0 && !isRateLimited && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
            <NotebookIcon className="size-10 text-primary"/>
            <h2 className="text-2xl font-bold">No Notes yet</h2>
            <Link to={"/create"} className="btn btn-primary">
              Create a Note
            </Link>
          </div>
        )}

        {notes.length > 0 && !isRateLimited && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              notes.map((note) => (
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              ))
            }
        </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
