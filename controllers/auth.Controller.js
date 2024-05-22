// all crud ops here
import con from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //console.log('register fun');
  //console.log(req.body);
  //CHECK EXISTING USER
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  con.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!!!");

    //We need to encrypt the password before storing in db , so we want brcyptjs npm package
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    //now we can insert new register user info

    const q = "INSERT INTO users(`username`,`email`,`password`,`img`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash,req.body.img];

    con.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  //console.log('login fun');
  
  //CHECK USER

  const q = "SELECT * FROM users WHERE username = ?";

  con.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).send("User not found!!!!");
    // console.log("data varibale printing " + data[0].password,data[0].username,data[0].email + "\n\n\n\n");

    //Check password
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    //password is corret now

    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    // console.log("\n\n"+token+"\n id id "+data[0].id);
    const { password, ...other } = data[0]; //removing the hashed password and sending it to cookies

    res
      .cookie("access_token", token, {
        httpOnly: true, //any script on the client side can't access the cookie except the api call we are doing
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  //console.log("logout fun");
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");

};
