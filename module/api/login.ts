import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import z from "zod";
import { User } from '../db';
import { signJWT } from '../jwt';

export async function login(request: Request, response: Response) {
  const LoginRequest = z.object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
  });
  let login_request;
  try {
    login_request = LoginRequest.parse(request.body);
  } catch(error){
    if(error instanceof z.ZodError) {
      response.status(400).send(z.prettifyError(error)); 
      return;
    }
  }
  const user = await User.findOneBy({ email: login_request!.email });
  if (!user) {
    response.status(400).send('Email not found'); 
    return;
  }
  if (!await bcrypt.compare(login_request!.password, user.password)) {
    response.status(400).send('Wrong Password!'); 
    return;
  }
  response.send({
    token: signJWT(user.id),
    user
  });
}
