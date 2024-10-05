import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name Required"],
  },
  email: {
    type: String,
    required: [true, "Email Required"],
  },
  Phone: {
    type: String,
    required: [true, "Phone Required"],
  },
  aboutMe: {
    type: String,
    required: [true, "About Me Is Required"],
  },
  password: {
    type: String,
    required: [true, "Password Required"],
    minLength: [8, "Password must contain at least 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  portfolioURL: {
    type: String,
    required: [true, "PortFolio URL Is Required"],
  },
  githubURL: String,
  leetcodeURL: String,
  linkedInURL: String,
  twitterURL: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});


//comparing password with hash password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


export const user = mongoose.model("User", userSchema);
