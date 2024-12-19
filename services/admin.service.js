const { json } = require('body-parser');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');


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
      return res.status(200).json({ status: false, code: 400, message: 'Username cannot be blank', result: null });
    }
    if (!password || password === '') {
      return res.status(200).json({ status: false, code: 400, message: 'Password cannot be blank', result: null });
    }

    const results = await sequelize.query('SELECT * FROM adm_user WHERE login_name = :login_name OR email_id = :login_name', {
      replacements: { login_name: username },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!results || results.length === 0) {
      return res.status(200).json({ status: false, code: 404, message: 'User not found', result: null });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, results[0].login_pass);

    if (!isPasswordCorrect) {
      return res.status(200).json({ status: false, code: 401, message: 'Invalid credentials', result: null });
    }
    let user =  results[0]

    const insertToken = await sequelize.query(`INSERT INTO public.adm_token(admin_id, added_date)VALUES (?, ?) RETURNING unique_id,token_id;`, {
      replacements: [ user.admin_id, moment().format('YYYY-MM-DD HH:mm:ss') ],
      type: sequelize.QueryTypes.INSERT,
    });

    const jwtUser = { 
      id: user.admin_id,
      unique_id: insertToken[0][0].unique_id,
      token_id: insertToken[0][0].token_id
    }
    const accessToken = jwt.sign(jwtUser, process.env.JWT_ACCESS_TOKEN_KEY,
      { algorithm: 'HS256', allowInsecureKeySizes: true, expiresIn: 432000, }
    );
    user.accessToken = accessToken;

    res.status(200).json({ status: true, code: 200, message: 'Login successful', result: user });
  } catch (error) {
    console.log(error);
    
    // console.error('Error during login:', error);
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
    res.status(201).json({ status: true, code: 201, message: 'User registered successfully', result: { Plain_Password: password, hashedPassword: hashedPassword } });

  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ status: false, code: 500, message: 'Internal server error', result: null });
  }
};

const logout = async (req, res) => {
  try {
    if (!req.token_data || req.token_data.length <1) {
      return res.status(200).json({ status: false, code: 400, message: 'Someting is wrong!.', result: null });
    }
    const token_data = req.token_data[0]
    await sequelize.query(`UPDATE adm_token SET is_logout=true WHERE admin_id = :admin_id and unique_id = :unique_id`, {
      replacements: { admin_id: token_data.admin_id, unique_id: token_data.unique_id },
      type: sequelize.QueryTypes.UPDATE,
    });
    res.status(201).json({ status: true, code: 201, message: 'User logout successfully', result: null });

  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ status: false, code: 500, message: 'Internal server error', result: null });
  }
};
const get_states = async (req, res) => {
  try {
    const response = await sequelize.query(`Select state_name as key,state_lgd_code as cat from state_lgd_data;`, {
      type: sequelize.QueryTypes.SELECT,
    });
    
    res.status(200).json({ status: true, code: 201, message: 'States List', result: response });

  } catch (error) {
    console.error('Some Error Occured', error.message);
    res.status(500).json({ status: false, code: 500, message: 'Internal server error', result: null });
  }
};

module.exports = {
  testApi,
  adminLogin,
  getHashPassword,
  logout,
  get_states
}
