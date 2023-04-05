import userSignup from "../mongodb/models/userSignup.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// const stripe = require("stripe")('sk_test_tR3PYbcVNZZ796tH88S4VQ2u');
import Stripe from "stripe";
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, Password } = req.body;
    const userExists = await userSignup.findOne({ email });
    if (userExists) {
      res.status(500).json({ message: "user already exists" });
      console.log("response", res.statusCode);
    } else {
      bcrypt.hash(Password, 10, function (err, hash) {
        // Store hash in your password DB.
        const Password = hash;
        userSignup.create({ firstName, lastName, email, Password });
        res.json({ message: "User successfully created" });
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

const verifyUser = (req, res, next) => {
  let authHeader = req.headers["authorization"];

  console.log("authheader...hit", authHeader);
  if (authHeader === undefined) {
    res.status(401);
    console.log("decoded undefinedddddddddddddddddddddddddddd");
  }
  let token = authHeader && authHeader.split(" ")[1];
  console.log("tokennnnnnnnnnnnnn", token);
  jwt.verify(token, "secret", function (err, decoded) {
    if (err) {
      res.status(500);
      console.log("decoded errorrrrrrrrrrrrr");
    } else {
      res.status(200).send(decoded);
      console.log("decoded trueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      next();
    }
  });
};

const loginUser = async (req, res) => {
  // const token=jwt.sign({})
  try {
    const { email, Password } = req.body;
    const TypedPassword = Password;
    const validEmail = await userSignup.findOne({ email });
    if (!validEmail) {
      res.json({ message: "Invalid User,Please Signup" });
    } else {
      // Load hash from your password DB.
      const password = await userSignup.find({ email: email });
      console.log("password data", password[0].Password);
      const dbPassword = password[0].Password;
      bcrypt.compare(TypedPassword, dbPassword).then(function (result) {
        // result == true

        if (result === true) {
          let resp = {
            id: password[0]._id.valueOf(),
            display_name: password[0].firstName,
          };
          let token = jwt.sign(resp, "secret", { expiresIn: 86400 });

          res.status(200).send({ auth: true, token: token });
        } else {
          res
            .status(500)
            .json({ message: "loggedIn Failed please check password" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const allUser = async (req, res) => {
  console.log("page ");
  try {
    const data = await userSignup.find();
    res.status(200).send({ data });
  } catch (error) {
    res.status(404).json({ message: "Data not found" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await userSignup.deleteOne({ _id: id });
    res.status(200);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const deleteOneUser = async (req, res) => {
  try {
    const delId = req.params.id;
    await userSignup.findOneAndRemove({ _id: delId });
    res.send({ message: "Deleted successfully" });
  } catch (error) {
    res.send({ message: error.message });
  }
};
const updateUser = async (req, res) => {
  const updateId = req.params.id;
  try {
    await userSignup.updateOne(
      { _id: updateId },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email:req.body.email
        },
      }
    );
    res.status(200).send({message:"Updated Successfully"})
  } catch (error) {
    res.status(401).send({message:"cannot update"})
  }
};
const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

// app.post("/create-payment-intent", async (req, res) => {
//   const { items } = req.body;

//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: "usd",
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });





export {
  createUser,
  loginUser,
  verifyUser,
  deleteUser,
  deleteOneUser,
  updateUser,
  allUser,
 
};
