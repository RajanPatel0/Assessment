import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim:true, lowercase: true, match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ] },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: {
        values: ['user', 'admin'],
        },
        default: 'user'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true});

userSchema.index({ role: 1 });

userSchema.pre('save', async function(next) {
   if (!this.isModified("password")) return;
  if(this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next;
}); 

const User = mongoose.model("User", userSchema);
export default User;