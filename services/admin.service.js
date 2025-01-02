const { json } = require('body-parser');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { result } = require('lodash');

function getSeason(dateString) {
  console.log('dateString',dateString , 'Type:', typeof dateString);
  
  const today = new Date(dateString); // Convert the string to a Date object
  
  // Extract month and day from today
  let month1 = today.getMonth(); // Month is 0-indexed (0 = January, 11 = December)
  const day = today.getDate();
  
  
  const month = Number(month1)+1
  // Define the start and end months and days for each season
  // Rabi: Dec 20 to Apr 3
  const rabiStart = { month: 11, day: 20 }; // December 20
  const rabiEnd = { month: 3, day: 3 }; // April 3
  
  // Zaid: Apr 4 to Jul 20
  const zaidStart = { month: 3, day: 4 }; // April 4
  const zaidEnd = { month: 6, day: 20 }; // July 20
  
  // Kharif: Jul 21 to Dec 19
  const kharifStart = { month: 6, day: 21 }; // July 21
  const kharifEnd = { month: 11, day: 19 }; // December 19
  console.log('month', month, 'Type:', typeof month);
  console.log('day', day, 'Type:', typeof day);
  
  console.log('rabiStart', rabiStart.month, 'Type:', typeof rabiStart.month);
  console.log('rabiEnd', rabiEnd.month, 'Type:', typeof rabiEnd.month);
  console.log('zaidStart', zaidStart.day, 'Type:', typeof zaidStart.day);
  console.log('zaidEnd', zaidEnd.day, 'Type:', typeof zaidEnd.day);
  console.log('kharifStart', kharifStart, 'Type:', typeof kharifStart);
  console.log('kharifEnd', kharifEnd, 'Type:', typeof kharifEnd);

  // Determine the current season by comparing the month and day
  if (
    (month == rabiStart.month && day >= rabiStart.day) || 
    (month == rabiEnd.month && day <= rabiEnd.day) ||
    (month > rabiStart.month && month < rabiEnd.month)
  ) {
    return 'Rabi';
  } else if (
    (month == zaidStart.month && day >= zaidStart.day) ||
    (month == zaidEnd.month && day <= zaidEnd.day) ||
    (month > zaidStart.month && month < zaidEnd.month)
  ) {
    return 'Zaid';
  } else if (
    (month == kharifStart.month && day >= kharifStart.day) ||
    (month == kharifEnd.month && day <= kharifEnd.day) ||
    (month > kharifStart.month && month < kharifEnd.month)
  ) {
    return 'Kharif';
  } else {
    return 'No season';
  }
}
const getAllDaysOfYear = (year) => {
  const startDate = moment(`${year}-01-01`);
  const endDate = moment(`${year}-12-31`);
  const days = [];

  // Loop from start date to end date
  let currentDate = startDate;
  while (currentDate <= endDate) {
    days.push(currentDate.format('YYYY-MM-DD'));
    currentDate.add(1, 'days');
  }

  return days;
};
// API handler to handle the request and get season based on date
const testApi = async (req, res) => {
  try {
    const dateString = req.query.date; // Use query parameter `date`
    if (!dateString) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: 'Date parameter is required.',
        result: null
      });
    }

    const days2024 = getAllDaysOfYear(2024);
    let seasonDayArray2024 = [];
    for (let day of days2024) {
      let season_day = await getSeason(day);
      seasonDayArray2024.push({ season_day, day });
      break; 
    }

    // const days2025 = getAllDaysOfYear(2025);
    // let seasonDayArray2025 = [];
    // for (let day of days2025) {
    //   let season_day = await getSeason(day);
    //   seasonDayArray2025.push({ season_day, day });
    // }

    const season = 'getSeason(dateString)';
    
    res.status(200).json({
      status: true,
      code: 200,
      message: 'API executed successfully',
      result: { season, seasonDayArray2024 }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      code: 404,
      message: error.message,
      result: null
    });
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
    const response = await sequelize.query(`Select state_name as key,state_lgd_code::string as cat from state_lgd_data;`, {
      type: sequelize.QueryTypes.SELECT,
    });
    
    res.status(200).json({ status: true, code: 201, message: 'States List', result: response });

  } catch (error) {
    console.error('Some Error Occured', error.message);
    res.status(500).json({ status: false, code: 500, message: 'Internal server error', result: null });
  }
};
const year_list = async (req, res, next) => {
  try {  
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();



      const adjustedYear = (currentMonth < 6) ? currentYear - 1 : currentYear;


      const yearsArray = [];
      for (let i = 0; i < 5; i++) {
          const startYear = adjustedYear - i;
          const endYear = startYear + 1;
          const list = {
              cat: `${startYear}-${endYear}`,
              key: `${startYear}-${endYear}`,
              is_default: i === 0
          }
          yearsArray.push(list);
      }
      return res.status(200).json({ status: true, code: 200, message: 'Year List', result: yearsArray });
  } catch (err) {
      return res.status(500).json({ status: false, code: 500, message: 'Internal server error', result: null });
  }
};
const make_visible = async (req, res, next) => {
  const {states,table_name,year,season,true_by,date}=req.body;
  try {  
      console.log("---------=========----",states)

      return res.status(200).json({ status: true, code: 200, message: 'Selections Are Now Visible', result: null });
  } catch (err) {
      return res.status(500).json({ status: false, code: 500, message: 'Internal server error', result: null });
  }
};
module.exports = {
  testApi,
  adminLogin,
  getHashPassword,
  logout,
  get_states,
  year_list,
  make_visible
}
