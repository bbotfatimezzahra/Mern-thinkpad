import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!title.trim() || !content.trim()){
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {title, content});
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Slow down you've made too many requests");
      }
      else{
        toast.error("Failed to create note")
      }
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset card bg-base-100 mb-4">
              <div className="card-body">

                <legend className="fieldset-legend card-title text-2xl mb-4">
                  Create New Note
                </legend>

                <label className="fieldset-label">Title</label>
                <input
                  type="text"
                  placeholder="Note Title"
                  className="input w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label className="fieldset-label">Content</label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea w-full h-32"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
