import ratelimit from "../config/upstash.js";

const rateLimiter = async(_,res,next)=>{
    try {
        const {success} = await ratelimit.limit("my_limit_key");

        if(!success){
            return res.status(429).json({message:"Too many requests, please try again later"});
        }

        next();
    } catch (error) {
        console.error("Rate limit error",error);
        next(error);
    }
};

export default rateLimiter;
