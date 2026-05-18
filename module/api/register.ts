import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import z from "zod";
import { User } from '../db';
import { signJWT } from '../jwt';

export async function register(request: Request, response: Response) {
  const RegisterRequest = z.object({
    name: z.string().nonempty(),
    email: z.string().nonempty(),
    password: z.string().nonempty(),
  });
  let register_request;
  try {
    register_request = RegisterRequest.parse(request.body);
  } catch(error){
    if(error instanceof z.ZodError) {
      response.status(400).send(z.prettifyError(error)); 
      return;
    }
  }
  if (await User.existsBy({ email: register_request!.email })) {
    response.status(400).send('Email already used'); 
    return;
  }
  const user = new User();
  user.name = register_request!.name;
  user.email = register_request!.email;
  user.password = await bcrypt.hash(register_request!.password, 10);
  await user.save();
  response.send({
    token: signJWT(user.id),
    user
  });
}
