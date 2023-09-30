const jwt = require('jsonwebtoken');
 
const { AppError } = require('../utils');

exports.regToken = (id) => 
    jwt.sign(
        { id }, 
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );

exports.checkToken = (token) => {
    if (!token) throw new AppError(401, 'Not authorized');
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        
        return id;

    } catch (err) {
        console.log(err)
        throw new AppError(401, 'Not authorized');
      }
}

