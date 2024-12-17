const { json } = require('body-parser');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');


const CustomerRegistration = async (req, res) => {
    const { firstname, lastname, mobile_no, email_id, password, username } = req.body;

    try {
        // Basic validation checks for required fields
        if (!username || username === '') {
            return res.status(200).json({ status: false, code: 400, message: 'Username cannot be blank', result: null });
        }
        if (!firstname || firstname === '') {
            return res.status(200).json({ status: false, code: 400, message: 'First name cannot be blank', result: null });
        }
        if (!lastname || lastname === '') {
            return res.status(200).json({ status: false, code: 400, message: 'Last name cannot be blank', result: null });
        }
        const plain_pass = password;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
        if (!password || password === '') {
            return res.status(200).json({ status: false, code: 400, message: 'Password cannot be blank', result: null });
        }
        if (!passwordRegex.test(password)) {
            return res.status(200).json({
                status: false,
                code: 400,
                message: 'Password must be at least 6 characters long, include at least one uppercase letter, one number, and one special character',
                result: null
            });
        }

        // Check if the user already exists by username or email using raw SQL query with replacements
        const checkUserQuery = `
            SELECT * FROM cst_customer WHERE username = :username OR email_id = :email_id
        `;
        const existingUser = await sequelize.query(checkUserQuery, {
            replacements: { username: username, email_id: email_id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (existingUser.length > 0) {
            return res.status(200).json({
                status: false,
                code: 400,
                message: 'Username or Email already exists',
                result: null
            });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database using raw SQL query with replacements
        const insertUserQuery = `
            INSERT INTO cst_customer (first_name, last_name, username, userpass, mobile_number, email_id, createat, plain_pass)
            VALUES (:firstname, :lastname, :username, :userpass, :mobile_no, :email_id, :createat, :plain_pass)
        `;
        
        await sequelize.query(insertUserQuery, {
            replacements: { 
                username: username, 
                firstname: firstname, 
                lastname: lastname, 
                mobile_no: mobile_no, 
                email_id: email_id, 
                userpass: hashedPassword ,
                plain_pass: plain_pass,
                createat: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            type: sequelize.QueryTypes.INSERT,
        });

        // Respond with success message
        return res.status(200).json({
            status: true,
            code: 201,
            message: 'User registered successfully',
            result: {
                username: username,
                firstname: firstname,
                lastname: lastname,
                email_id: email_id,
            }
        });

    } catch (error) {
        console.error('Error during registration:', error.message);
        return res.status(500).json({ status: false, code: 500, message: 'Internal server error', result: null });
    }
};

const CustomerList = async (req, res) => {
    const { list_type } = req.body;
    const list_type_array = ['active', 'pending', 'all'];
    try {
        if (!list_type || !list_type_array.includes(list_type)) {
            return res.status(200).json({status: false,code: 400,message: 'Invalid or missing list type',result: null});
        }
        let typeQry = '';
        if (list_type === 'active') {
            typeQry = ' AND is_activated = true';
        } else if (list_type === 'pending') {
            typeQry = ' AND is_activated = false';
        }

        const checkUserQuery = ` SELECT * FROM cst_customer WHERE is_deleted = false ${typeQry} `;

        const existingUser = await sequelize.query(checkUserQuery, {
            type: sequelize.QueryTypes.SELECT,
        });
        if (existingUser.length === 0) {
            return res.status(200).json({status: false,code: 404,message: 'No users found for the given list type',result: null});
        }

        return res.status(200).json({status: true,code: 200,message: 'User list fetched successfully',result: existingUser});

    } catch (error) {
        console.error('Error fetching customer list:', error.message);
        return res.status(500).json({status: false,code: 500,message: 'Internal server error',result: null});
    }
};



module.exports = {
    CustomerRegistration,
    CustomerList
}
