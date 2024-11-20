import { RoomModel } from "../models/room.model";
import { Router } from "express";
import asyncHandler from 'express-async-handler';
import { ReservationModel } from "../models/reservation.model";
import {NzMessageService} from 'ng-zorro-antd/message';
import mongoose from 'mongoose';
import { Types } from 'mongoose';
const { ObjectId } = Types;
const router = Router();

router.post('/book', async (req, res) => {
    try {
      const { roomId, userId, startDate, endDate, totalPrice } = req.body;
      const room = await RoomModel.findById(roomId);
      if (!room) {
        return res.status(404).send('Pokój nie został znaleziony.');
      }
      const reservation = new ReservationModel({
        roomId,
        userId, 
        startDate,
        endDate,
        totalPrice
      });
      
      await reservation.save();

      res.status(201).send(reservation);
    } catch (error) {
      res.status(500).send('Wystąpił błąd przy tworzeniu rezerwacji.');
    }
  });

  router.get('/check-availability', async (req, res) => {
    const { startDate, endDate, roomId } = req.query;

    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
        return res.status(400).send('Nieprawidłowy lub brak daty');
    }

    if (typeof roomId !== 'string') {
        return res.status(400).send('Nieprawidłowy lub brak roomId');
    }
    
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const isAvailable = await checkRoomAvailability(start, end, roomId);
        res.json({ isAvailable });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.get('/my-reservations/:userId', async (req, res) => {
  const userId = req.params.userId; 

  try {

    const reservations = await ReservationModel.find({ userId: userId }).populate('roomId');

    if (reservations.length === 0) {
      return res.status(404).json({ message: "Nie znaleziono rezerwacji dla tego użytkownika." });
    }
    res.json(reservations);
  } catch (error) {

    res.status(500).json({ message: error });
  }
});

router.delete('/delete-reservation', async (req, res) => {
  try {
      const { id } = req.body; // Pobieranie ID z ciała żądania
      const reservation = await ReservationModel.findByIdAndDelete(id);
      if (!reservation) {
          return res.status(404).send({ message: 'Reservation not found!' });
      }
      res.send({ message: 'Reservation deleted successfully!' });
  } catch (error) {
      res.status(500).send({ message: error });
  }
});

router.get('/admin-reservations', async (req,res) => {
    const adminReservations = await ReservationModel.find().populate("roomId").populate("userId");
    res.send(adminReservations);
})

const checkRoomAvailability = async (startDate: Date, endDate: Date, roomId: string) => {
    const overlapReservation = await ReservationModel.findOne({
        roomId: new ObjectId(roomId),
        $or: [
            { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
        ],
    });

    return !overlapReservation;
};



  export default router;