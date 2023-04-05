import jwt from "jsonwebtoken";
export const protect=(req,res,next)=>{
   
    let authHeader= req.headers["authorization"];;
   
    console.log("authheader...hit",authHeader); 
    if(authHeader===undefined){
      res.status(401)
    }
    let token=authHeader && authHeader.split(" ")[1]
    jwt.verify(token,"secret",function(err,decoded){
      if(err){
        res.send({message:"no tokken"})
      }else{
        res.status(200)
        next()
      }
    })
  }