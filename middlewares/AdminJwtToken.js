const sequelize = require('../config/db');
const jwt = require('jsonwebtoken');

const jwtAdmin = async (req, res, next) => {
    const accessToken = req.headers["x-access-token"];
    
    if (!accessToken) {
        return res.status(400).json({ status: false, code: 401, message: 'Access token is required for authentication.', result: null });
    }
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_KEY);

        const user_data = await sequelize.query('SELECT * FROM adm_token WHERE admin_id = :admin_id and unique_id = :unique_id and is_logout=false', {
            replacements: { admin_id: decoded.id, unique_id: decoded.unique_id},
            type: sequelize.QueryTypes.SELECT,
        });

        if (!user_data || user_data.length <= 0) {
            return res.status(200).json({ status: false, code: 401, message: 'Session is expired or invalid.', result: null });
        }
        if (user_data.is_logout) {
            return res.status(200).json({ status: false, code: 401, message: 'Session is expired or invalid.', result: null });
        }
        
        req.token_data = user_data;
    } catch (err) {
        console.log(err);
        return res.status(401).json({ status: false, code: 401, message: 'Unauthorized! Invalid access token.', result: null });
    }
    return next();
};

module.exports = jwtAdmin