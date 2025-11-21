const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').limit(10);
    res.render('index', { users });
  } catch (error) {
    res.render('index', { users: [], error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.render('users', { users });
  } catch (error) {
    res.render('users', { users: [], error: error.message });
  }
});

router.get('/register', (req, res) => {
  res.render('register', { error: null, success: null });
});

router.post('/register', async (req, res) => {
  try {
    const { userId, firstName, lastName, email, password } = req.body;

    if (!userId || !firstName || !lastName || !email || !password) {
      return res.render('register', {
        error: 'Todos los campos son requeridos',
        success: null
      });
    }

    const existingUser = await User.findOne({
      $or: [{ userId }, { email }]
    });

    if (existingUser) {
      return res.render('register', {
        error: 'El ID de usuario o el correo electrónico ya existe',
        success: null
      });
    }

    const user = new User({
      userId,
      firstName,
      lastName,
      email,
      password
    });

    await user.save();
    res.redirect('/users');
  } catch (error) {
    res.render('register', {
      error: error.message,
      success: null
    });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('login', {
        error: 'El correo electrónico y la contraseña son requeridos'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        error: 'Credenciales inválidas'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.render('login', {
        error: 'Credenciales inválidas'
      });
    }

    res.redirect(`/user/${user.userId}`);
  } catch (error) {
    res.render('login', {
      error: error.message
    });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.render('error', { message: 'Usuario no encontrado' });
    }

    res.render('user', { user: user.toJSON() });
  } catch (error) {
    res.render('error', { message: error.message });
  }
});

router.get('/user/:userId/edit', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.render('error', { message: 'Usuario no encontrado' });
    }

    res.render('edit', { user: user.toJSON(), error: null, success: null });
  } catch (error) {
    res.render('error', { message: error.message });
  }
});

router.post('/user/:userId/edit', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, password } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.render('error', { message: 'Usuario no encontrado' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
      const existingUser = await User.findOne({ email, userId: { $ne: userId } });
      if (existingUser) {
        return res.render('edit', {
          user: user.toJSON(),
          error: 'El correo electrónico ya está en uso',
          success: null
        });
      }
      user.email = email;
    }
    if (password) user.password = password;

    await user.save();
    res.redirect(`/user/${userId}`);
  } catch (error) {
    res.render('edit', {
      user: req.body,
      error: error.message,
      success: null
    });
  }
});

router.post('/user/:userId/delete', async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findOneAndDelete({ userId });
    res.redirect('/users');
  } catch (error) {
    res.render('error', { message: error.message });
  }
});

module.exports = router;

