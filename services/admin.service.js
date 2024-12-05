const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');


const testApi = async (req, res) => {
  try {
    res.status(201).json({ status: true, code: 200, message: 'Get Api run successfully', result: null });
  } catch (error) {
    res.status(400).json({ status: false, code: 404, message: error.message, result: null });
  }
};

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || username === '') {
      return res.status(400).json({ status: false, code: 400, message: 'Username cannot be blank', result: null });
    }
    if (!password || password === '') {
      return res.status(400).json({ status: false, code: 400, message: 'Password cannot be blank', result: null });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ status: false, code: 400, message: 'Password must be at least 6 characters long, include at least one uppercase letter, one number, and one special character', result: null });
    }

    const results = await sequelize.query('SELECT * FROM adm_user WHERE login_name = :login_name OR email_id = :login_name', {
      replacements: { login_name: username },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!results || results.length === 0) {
      return res.status(404).json({ status: false, code: 404, message: 'User not found', result: null });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, results[0].login_pass);

    if (!isPasswordCorrect) {
      return res.status(401).json({ status: false, code: 401, message: 'Invalid credentials', result: null });
    }

    res.status(200).json({ status: true, code: 200, message: 'Login successful', result: results[0] });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ status: false, code: 500, message: 'Internal server error', result: null });
  }
};


const getHashPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!password || password === '') {
      return res.status(400).json({ status: false, code: 400, message: 'Password cannot be blank', result: null });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'Password must be at least 6 characters long, include at least one uppercase letter, one number, and one special character',
        result: null
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);


    // Respond with the newly created user (do not send password in the response)
    res.status(201).json({ status: true,code: 201, message: 'User registered successfully', result: { Plain_Password: password, hashedPassword: hashedPassword } });

  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ status: false, code: 500, message: 'Internal server error', result: null });
  }
};

module.exports = {
  testApi,
  adminLogin,
  getHashPassword
}
