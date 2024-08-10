import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note,setNote]=useState({title:"", description:"",tag:""})
  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title,note.description,note.tag);
    setNote({title:"", description:"",tag:""})
    props.showAlert("Added successfully","success")
  };
  const onChange=(e)=>{
    setNote({...note,[e.target.name]:e.target.value})
  };

  return (
    <div classNameName="container my-3">
      <h3>Add a Note</h3>
      <form classNameName="my-3">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            aria-describedby="emailHelp"
            placeholder="Enter the title of your note"
            value={note.title}
            onChange={onChange}
            minLength={5}
            required

          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            placeholder="Description of your note"
            value={note.description}
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            placeholder="Tag of your note"
            value={note.tag}
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
