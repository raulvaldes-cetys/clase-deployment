const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

router.post('/register', async (req, res) => {
  try {
    const { userId, firstName, lastName, email, password } = req.body;

    if (!userId || !firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ userId }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El ID de usuario o el correo electrónico ya existe'
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

    const token = generateToken(user.userId);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico y la contraseña son requeridos'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = generateToken(user.userId);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error durante el inicio de sesión',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, password } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
      const existingUser = await User.findOne({ email, userId: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El correo electrónico ya está en uso'
        });
      }
      user.email = email;
    }
    if (password) user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndDelete({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
});

module.exports = router;
