const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

async function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ message: 'Missing authorization' });
  const parts = h.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid authorization' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // load full user from db to check banned status
    const user = await User.findById(payload.id).lean().catch(()=>null);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });
    if (user.banned) return res.status(403).json({ message: 'User banned' });
    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireRole(roleOrArray) {
  return function(req, res, next){
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    const roles = Array.isArray(roleOrArray) ? roleOrArray : [roleOrArray];
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  }
}

async function optionalAuth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return next();
  const parts = h.split(' ');
  if (parts.length !== 2) return next();
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).lean().catch(() => null);
    if (user && !user.banned) {
      req.user = { id: user._id.toString(), email: user.email, role: user.role };
    }
  } catch (err) {}
  next();
}

module.exports = { auth, optionalAuth, requireRole };
