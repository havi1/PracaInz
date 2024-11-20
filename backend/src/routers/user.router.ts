import { Router } from "express";import { sample_users } from "../data";
const jwt = require('jsonwebtoken');
import asyncHandler from 'express-async-handler'
import { UserModel } from "../models/user.model";
import { hashPassword } from "../configs/hashService";
import { Request, Response, NextFunction } from 'express';
require('dotenv').config(); // Załaduj zmienne środowiskowe
const bcrypt = require('bcrypt');
const router = Router();
const secret = process.env.JWT_SECRET;



router.get("/seed", asyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if(usersCount > 0) {
            res.send("Seed jest już dodany");
            return
        }
        await UserModel.create(sample_users);
        res.send("Seed został dodany");
    }
))

router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = generateToken(user);
      res.cookie('token', token, { httpOnly: true});
      res.cookie('isAdmin', user.isAdmin, { httpOnly: true});
  

      res.json({
        name: user.name,
        id: user._id,
      });
    } else {
      res.status(401).send("Nazwa użytkownika albo hasło jest nieprawidłowe!");
    }
  }));

  router.post("/changePassword", async(req,res) => {
    const {userId, oldPassword, newPassword, newPasswordCheck} = req.body;
    console.log(userId);
    const user = await UserModel.findById(userId); 
  
    if(user) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if(isMatch) {
        if(newPassword === newPasswordCheck) {
          const newHashedPassword = await hashPassword(newPassword); 
          user.password = newHashedPassword;
          await user.save();
          res.status(200).send("Hasło zostało zmienione.");
        } else {
          res.status(400).send("Nowe hasła nie pasują do siebie.");
        }
      } else {
        res.status(400).send("Stare hasło jest nieprawidłłowe.");
      }
    } else {
      res.status(404).send("Nie znaleziono uzytkownika.");
    }
  });

  router.get('/getOne/:userId', async(req,res) => {
    const user = await UserModel.findById(req.params.userId);
    res.json({
      email: user?.email,
      name: user?.name,
      address: user?.address,
      id: user?.id
    })
  })

router.post('/register', asyncHandler(async(req,res) => {
        const {name,email,address,password, password_repeat} = req.body;
        const user = await UserModel.findOne({email})
        if(!user ) {
            const isAdmin = false;
            const hashedPassword = await hashPassword(password);
            const registerUser = new UserModel({
                name, 
                email, 
                password: hashedPassword,
                address,
                isAdmin
            })
            await registerUser.save()
            res.status(201).send()
        } else  {
        res.status(500).send('Wystąpił błąd przy rejestracji.');
    }
}))

const generateToken = (user:any) => {
    return jwt.sign({
      email: user.email,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.send(false); 
      return;
    }
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.send(false); 
    return;
  }
};
  
router.get("/isAuth", verifyToken, (req, res) => {
  res.send(true);
});

router.get("/isAdmin", verifyToken, (req, res) => {
  if (req.user && req.user.isAdmin) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.clearCookie('isAdmin');
  res.send('Wylogowano pomyślnie');
});

export default router;