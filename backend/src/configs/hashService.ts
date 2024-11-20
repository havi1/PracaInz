import * as bcrypt from 'bcrypt';

const saltRounds: number = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt(saltRounds);
  const hash: string = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};