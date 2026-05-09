import mongoose from 'mongoose';

// Use the same cookieOptions object everywhere
const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // always lowercase
  path: '/',
  maxAge,
});

export { cookieOptions };
