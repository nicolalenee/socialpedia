import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* register user */

export const register = async (req, res) => {
  try {
    // destructure these parameters from req.body
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
    } = req.body;
    // encrypt password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000)
    });
    const savedUser = await newUser.save();
    // send user status code then create json version of saved user and send back to front end
    res.status(201).json(savedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** Loggin in  */
export const login = async(req, res) => {
  try {
    // destructure email and password from when user tries to login
    const { email, password } = req.body;

    // find the user by their email, if != in db then return err
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User does not exist. "});

    // compare pw entry to pw in db , if != then return err
    const isMatch = await bcrypt.compare(password, user.password );
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials. "});

    // if everything returns okay, sign a jwt
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET );
    // delete the password so it doesn't get sent back to front
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}