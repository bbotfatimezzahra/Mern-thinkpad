import { useEffect, useState } from "react"
import LoadingSpin from "../components/LoadingSpin";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";

const NotePage = () => {

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        console.log(res.data);
        setNote(res.data);
      } catch (error) {
        console.log("Error fetching note");
        toast.error("Failed to load note");
      }
      finally{
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);


  const handleDelete = async ()=>{
    if(!window.confirm("Are you sure you want to delete the note?"))return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.log("Error in handleDelete NotePage");
      toast.error("Failed to delete note");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if(!note.title.trim() || !note.content.trim()){
      toast.error("All fields are required");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note changed successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to change note");
      console.log("Error in handleUpdate",error);
    }finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {loading? <LoadingSpin /> : 
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">

            <Link to={"/"} className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>

            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="size-5" />
              Delete Note
            </button>
          </div>

          <form onSubmit={handleUpdate}>
            <fieldset className="fieldset card bg-base-100 mb-4">
              <div className="card-body">

                <label className="fieldset-label">Title</label>
                <input
                  type="text"
                  placeholder="Note Title"
                  className="input w-full"
                  value={note?.title}
                  onChange={(e) => setNote({...note, title:e.target.value})}
                />
                <label className="fieldset-label">Content</label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea w-full h-32"
                  value={note?.content}
                  onChange={(e) => setNote({...note, content:e.target.value})}
                ></textarea>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Change"}
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
        }
      </div>
    </div>
 
  )
}

export default NotePage
