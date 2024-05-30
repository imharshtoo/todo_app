import React,{useContext, useEffect, useRef,useState} from 'react'
import noteContext from "../context/notes/noteContext";
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context=useContext(noteContext); 
    const {notes,getNotes,editNote}=context;
    const ref=useRef(null);
    const refClose=useRef(null);
    let history=useNavigate();
    useEffect(()=>{
        if(localStorage.getItem("token")){
            getNotes();
        }
        else{
            history("/login");
        }
        // eslint-disable-next-line
    },[])
    const [note,setNote]=useState({id:"",etitle:"",edescription:"",etag:""})
    const updateNote=(currentnote)=>{
        ref.current.click();
        setNote({id:currentnote._id,etitle:currentnote.title,edescription:currentnote.description,etag:currentnote.tag});
        
    }
    const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value});
    }
    const handleClick=(e)=>{
        e.preventDefault();
        editNote(note.id,note.etitle,note.edescription,note.etag)
        refClose.current.click();
        props.showAlert("updated successfully","success");
    }
    return (
        <>
            <AddNote showAlert={props.showAlert}/>
                <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
                </button>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"  aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                            <form className="my-3">
                            <div className="mb-3">
                            <label htmlFor="etitle" className="form-label">
                                title
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="etitle"
                                value={note.etitle}
                                name='etitle'
                                aria-describedby="emailHelp"
                                onChange={onChange}
                                minLength={5}
                                required
                            />
                            </div>
                            <div className="mb-3">
                            <label htmlFor="edescription" className="form-label">
                                Description
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="edescription"
                                name='edescription'
                                value={note.edescription}
                                onChange={onChange}
                                minLength={5}
                                required
                            />
                            </div>
                            <div className="mb-3">
                            <label htmlFor="etag" className="form-label">
                                Tag
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="etag"
                                value={note.etag}
                                name='etag'
                                onChange={onChange}

                            />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" onClick={handleClick} className="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div>
            <div className='row my-3'>
                <h2>Your Notes</h2>
                <div className="container mx-2">
                {notes.length===0  && "No notes to display"}
                </div>
                {notes.map((note)=>{
                    return <Noteitem note={note} key={note._id} updateNote={updateNote} showAlert={props.showAlert}/>;
                })}
            </div>
        </>
    )
}

export default Notes
