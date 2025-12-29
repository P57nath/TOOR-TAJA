export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'this is my secret key for dev purpose 123456789',
  expiresIn: '15m',
};
