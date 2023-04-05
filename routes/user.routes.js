import express from "express";
import { protect } from "../middlewares/protect.js";
import {
  allUser,
  createUser,
  deleteOneUser,
  deleteUser,
  loginUser,
  updateUser,
} from "../controllers/user.controller.js";
const router = express.Router();
router.route("/").post(createUser);
router.get("/", protect, allUser);
router.delete("/:id", deleteOneUser);
router.post("/update/:id", updateUser);
// router.route("/").get(protect,allUser);
router.route("/login").post(loginUser);
router.route('/create-checkout-session').post()


export default router;
