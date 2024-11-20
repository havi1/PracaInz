import { Schema, model } from "mongoose";

export interface Reservation {
    id:string;
    roomId:string;
    userId:string;
    startDate:Date;
    endDate:Date;
    totalPrice:number;
}


const reservationSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, ref: 'room', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true }, 
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
  });

export const ReservationModel = model<Reservation>('reservationModel', reservationSchema);