import passport from 'passport';

export const protect = passport.authenticate('jwt', { session: false });
export const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
