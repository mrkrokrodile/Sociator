import mongoose from "mongoose";
import { isEmail } from "validator"
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            maxlength: 1024,
            minlength: 6
        },
        picture: {
            type: String,
            default: "./uploads/profil/random-user.png"
          },
          bio :{
            type: String,
            max: 1024,
          },
          followers: {
            type: [String]
          },
          following: {
            type: [String]
          },
          likes: {
            type: [String]
          }
    },
    {
        timestamps: true,
      }
);

// play function before save into display: 'block',
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const UserModel = mongoose.model('user', userSchema);
export default UserModel