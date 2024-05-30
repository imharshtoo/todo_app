const express=require("express");
const fetchuser = require("../middleware/fetchuser");
const router=express.Router();
const Note=require("../models/Note");
const {body, validationResult} =require("express-validator");
//ROute1 :Get all the notes using : Get 
router.get("/fetchallnotes",fetchuser, async (req,res)=>{
    try {
        const notes=await Note.find({user:req.user.id});
        res.json(notes)
    } catch(error){
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})
// Route 2:Add a new Note using: POST "/api/auth/getuser". Login required
router.post("/addnote",fetchuser,[
    body("title","enter a valid title").isLength({min:3}),
    body("description","description must be at least 5 characters").isLength({min:5}),
], async (req,res)=>{
    try {
        
        const {title,description,tag}=req.body;
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
    
        const note=new Note({
            title,description,tag,user:req.user.id
        })
        const savedNote=await note.save();
        res.json(savedNote)
    } catch(error){
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})
//Route 3:Update an existing Note using: POST "/api/auth/updatenote". Login required
router.put("/updatenote/:id",fetchuser, async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
        //create a newNote object
        const newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};
        //Find the note to be updated and update it
        let note=await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")}
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not allowed");
        }
        note= await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json({note});
    } catch(error){
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})
//Route 4:deleting an existing Note using: Del "/api/notes/deletenote". Login required
router.delete("/deletenote/:id",fetchuser, async (req,res)=>{
    try {
        // const {title,description,tag}=req.body;
        //create a newNote object
        //Find the note to be delete and delete it
        let note=await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")}
        //allow deletion only if user owns this note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not allowed");
        }
        note= await Note.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted",note:note});
    } catch(error){
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})

module.exports=router;