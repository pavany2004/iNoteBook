const express = require("express");

const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note= require("../models/Note");

const { body, validationResult } = require("express-validator");
// Route 1 ::  Get all the notes: GET "/api/notes/getuser".  login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal sever error occured");
  }
});

// Route 2 ::  Add a new node using : POST "/api/notes/addnote".  login required

router.post("/addnote",fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({min: 5,}),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // if there are the errors return the bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal sever error occured");
    }
  }
);

// Route 3 ::  update an existing  note  : using PUT "/api/notes/updatenote".  login required

router.put("/updatenote/:id",fetchuser ,async (req, res) => {
    const {title, description, tag}=req.body;
    // create a new note object 
    try {
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};
    
    // find the note to be updated and upadet it

    let note=await Note.findById(req.params.id);
    if(!note){
      return   res.status(404).send("Not Found")
    }

    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not allowed");
    }

    note=await Note.findByIdAndUpdate(req.params.id, {$set: newNote},{new:true})
    res.json({note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal sever error occured");
  }
})


// Route 4 ::  Delete an existing  note  : using delete "/api/notes/deletenote".  login required

router.delete("/deletenote/:id",fetchuser ,async (req, res) => {

    // find the note to be deleted and delete it
    try {
    let note=await Note.findById(req.params.id);
    if(!note){
      return   res.status(404).send("Not Found")
    }
    // allow deletion only if the user owns the note
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not allowed");
    }

    note=await Note.findByIdAndDelete(req.params.id)
    res.json({"Success" : "Note has been deleted ",note:note})

} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal sever error occured");
  }
})
module.exports = router;
