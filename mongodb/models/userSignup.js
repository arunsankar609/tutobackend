import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type:String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },

});

const userSignup = mongoose.model("UserSignup", UserSchema);



export default userSignup