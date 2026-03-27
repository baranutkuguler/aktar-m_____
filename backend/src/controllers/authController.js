// ──────────────────────────────────────────────
// Auth Controller
// Uses bcrypt for password hashing.
// ──────────────────────────────────────────────

const bcrypt = require('bcrypt');
const { users, nextUserId } = require('../data/mockDb');

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Body: { name, tax_id, email, home_address, password }
 */
const register = async (req, res) => {
  try {
    const { name, tax_id, email, home_address, password } = req.body;

    // ── Validation ─────────────────────────────
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Name, email, and password are required' });
    }

    // Check for duplicate email
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: 'A user with this email already exists' });
    }

    // ── Hash password ──────────────────────────
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      id: nextUserId(),
      name,
      tax_id: tax_id || '',
      email,
      home_address: home_address || '',
      password_hash,
    };

    users.push(newUser);

    // Return user data without the hash
    const { password_hash: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: safeUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' });
    }

    // ── Find user ──────────────────────────────
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    // ── Compare password ───────────────────────
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const { password_hash: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: safeUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login };
