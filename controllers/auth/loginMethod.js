const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSQL = require("../../models/models").User;

const postLogin = async (req, res) => {
  try {
    console.log("login event came");
    const { mail, password } = req.body;

    //const user = await User.findOne({ mail: mail.toLowerCase() });

    let user=  await   UserSQL.findOne({
      where: {

        mail: mail.toLowerCase()
      }

     });

    if (user && (await bcrypt.compare(password, user.password))) {
      // send new token
      const token = jwt.sign(
        {
          userId: user._id,
          mail,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
console.log("returning user");
      return res.status(201).json({
        error:"",
        userDetails: {
          mail: user.mail,
          token: token,
          username: user.username,
          _id: user._id,
        },
      });
    }
    else
    {
      console.log("user object not found");
    }

    return res.status(201).send({error:"Invalid credentials. Please try again"});
  } catch (err) {

    console.log(err);
    return res.status(201).send({error:"Something went wrong at server end. Please try again"});
  }
};

module.exports = postLogin;
