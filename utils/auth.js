//middleware fpr ===> only verified person can create a post
const jwt= require('jsonwebtoken');
module.exports=(req, res, next)=>{
    const authHeaders=req.headers.authorization;
    // const token =authHeaders.split('Bearer ')[1];
    const token =authHeaders;
    // console.log(token);
    try {
        jwt.verify(token, process.env.SECRET);
        next(); //below code run also
    } catch (error) {
        return res.status(401).json({errors:[{msg:error.message}]});
    }
}