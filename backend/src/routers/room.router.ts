import { RoomModel } from './../models/room.model';
import { Router } from "express";import { sample_rooms, sample_tags } from "../data";
import asyncHandler from 'express-async-handler';
import { CommentModel } from '../models/comment.model';
import upload from '../configs/multiMiddleware';
import cloudinary from '../configs/cloudinaryConfig';
const router = Router();

router.get("/seed", asyncHandler(
    async (req, res) => {
        const usersCount = await RoomModel.countDocuments();
        if(usersCount > 0) {
            res.send("Seed jest już dodany");
            return
        }
        await RoomModel.create(sample_rooms);
        res.send("Seed został dodany");
    }
))

router.get("/",asyncHandler(
    async(req,res) => {
        const rooms = await RoomModel.find()
        res.send(rooms);
    }
))

router.get("/search/:searchTerm",asyncHandler(
    async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, 'i');
    const rooms = await RoomModel.find({name:{$regex:searchRegex}})
    res.send(rooms);
})) 

router.post("/comment/create", async(req,res) =>{
 try {
    const {userId, roomId,createDate, text,rating} = req.body;
    const room = await RoomModel.findById(roomId);
      if (!room) {
        return res.status(404).send('Pokój nie został znaleziony.');
      }
      const comment = new CommentModel ({
        userId,
        roomId,
        createDate, 
        text,
        rating
      });
      await comment.save();
      res.status(201).send(comment);
 }
 catch(error) {
    res.status(500).send('Wystąpił błąd przy tworzeniu komentarza.');
 }
})

router.post("/comment", async(req,res)  => {
    try {
        const {roomId} = req.body;
        const comments = await CommentModel.find({roomId: roomId}).populate('userId');
        res.send(comments);
    } catch(error) {
        res.status(500).send('Wystąpił błąd przy pobieraniu komentarzy.');
     }

})

router.get("/tags",asyncHandler(
    async (req, res) => {
 const tags = await RoomModel.aggregate([
    {
    $unwind:'$tag'
 },
 {
 $group: {
    _id: '$tag',
    count: {$sum: 1}
 }
 }, {
    $project: {
        _id:0,
        name:'$_id',
        count:'$count'
    }
 }
]).sort({count: -1})
const all = {
    name: 'Wszystkie', 
    count: await RoomModel.countDocuments()
}
tags.unshift(all);
 res.send(tags);
}))

router.get("/tag/:tagName",asyncHandler(
async (req, res) => {
   const rooms = await RoomModel.find({tag: req.params.tagName})
    res.send(rooms);
}
));
 
router.get("/sort/:sortName", async (req, res) => {
    const sortName = req.params.sortName;

    try {
        let rooms;
        if (sortName === "up") {
            rooms = await RoomModel.find().sort({price: 1});
        } else if (sortName === "down") {
            rooms = await RoomModel.find().sort({price: -1});
        } else {
            return res.status(400).send({message: "Nieprawidłowy parametr sortowania"});
        }

        res.send(rooms);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({message: "Błąd podczas pobierania pokoi", error: error.message});
        } else {
            res.status(500).send({message: "Błąd podczas pobierania pokoi", error: "Nieznany błąd"});
        }
    }
});

router.get("/:id", asyncHandler(
    async(req,res) => {
const room = await RoomModel.findById(req.params.id)
res.send(room);
}))
router.post("/filter/:filterName", asyncHandler( 
    async(req,res) => {
    const cenaMin:number = req.body.cenaMin;
    const cenaMax:number = req.body.cenaMax;
    const pokoiMax:number = req.body.liczbaPokoiMax;
    const pokoiMin:number = req.body.liczbaPokoiMin;
    const gosciMin:number = req.body.liczbaGosciMin;
    const gosciMax:number = req.body.liczbaGosciMax;
    const filterName = req.params.filterName;
        if (filterName === "filtred") {
            try {
                const filteredRooms = await RoomModel.find({
                    price: { $gte: cenaMin, $lte: cenaMax },
                    maxGuests: { $gte: gosciMin, $lte: gosciMax },
                    rooms: { $gte: pokoiMin, $lte: pokoiMax }
                }).sort({ price: 1 }); 
                res.send(filteredRooms);
            } catch (error) {
                res.status(500).send({ message: "Błąd podczas wyszukiwania pokoi", error: error });
            }
        } else {
            res.status(400).send({ message: "Nieprawidłowa nazwa filtru" });
        }
    }));

      router.post('/upload', upload.fields([{ name: 'imageUrl', maxCount: 1 }, { name: 'imageUrls' }]), async (req, res) => {
        try {
          const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
          };
      
          const roomData = JSON.parse(req.body.data);
          let imageUrl = '';
          const imageUrls = [];
      
          if (files && files.imageUrl) {
            const result = await cloudinary.uploader.upload(files.imageUrl[0].path);
            imageUrl = result.url;
          }
      
          if (files && files.imageUrls) {
            for (const file of files.imageUrls) {
              const result = await cloudinary.uploader.upload(file.path);
              imageUrls.push(result.url);
            }
          }
          const newRoom = new RoomModel({
            ...roomData,
            imageUrl, 
            imageUrls 
          });
      
          await newRoom.save();
      
          res.json({ message: 'Pokój dodany', room: newRoom });
        } catch (error) {
          res.status(500).send('Błąd w dodawaniu.');
        }
      });

export default router;