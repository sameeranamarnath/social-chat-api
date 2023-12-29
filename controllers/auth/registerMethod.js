const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSQL = require("../../models/models").User;

const postRegister = async (req, res) => {
  try {
    const { username, mail, password } = req.body;

    console.log("user register request came");
    // check if user exists
   // const userExists = await User.exists({ mail: mail.toLowerCase() });

   let theUser=  await   UserSQL.findOne({
      where: {

        mail: mail.toLowerCase()
      }

     });
     console.log(theUser);
    //console.log(userExists);

   if (theUser!=null && theUser._id!=null) {
    console.log("email already registered");
      return res.status(201).send({error:"E-mail already in use."});
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user document and save in database
    /*
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    }); //
  */

      const userSQL =  await UserSQL.create({
        username,
        mail: mail.toLowerCase(),
        password: encryptedPassword,
      });
      console.log("sql user:"+userSQL);
    //  console.log(user);

    // create JWT token
    const token = jwt.sign(
      {
        userId: userSQL._id,
        mail,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetails: {
        mail: userSQL.mail,
        token: token,
        username: userSQL.username,
        _id: userSQL._id,
      },
      
    });
  } catch (err) {
    console.log(err);
    return res.status(201).json({err:`Error occured. ${err.message}`});
  }
};

module.exports = postRegister;
