const db = require("../database")
const bcrypt = require("bcryptjs");



exports.register = (req,res)=>{
    console.log(req.body)

    const {name,phone_num,email,password,confirm_password}=req.body;

    db.query("Select email from users where username = ? or email = ?", [name,email],async (err,result)=>{
        if(err){
            console.log(err)
        }

        if(result.length>0){
            return res.render("register",{
                message:"that username or email is already in use",
                formData: req.body
            })
        }else if(password!== confirm_password){
            return res.render("register",{
                message:"password does not match",
                formData: req.body
            })
        }

        let hashedPassword = await bcrypt.hash(password,8)
        db.query("insert into users set?", {username:name,phone_num:phone_num,email:email,password:hashedPassword}, (err,result)=>{
            if(err){
                console.log(err)
            }else{
                console.log(result)
                return res.render("register",{
                    message:"User registered"
                })
            }
        })
    })
}

