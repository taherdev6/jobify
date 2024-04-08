import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: "last name",
  },
  location: {
    type: String,
    default: "earth",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: String,
  avatarPublicId: String,
});

UserSchema.methods.toJSON = function () {
  let object = this.toObject();
  delete object.password;
  return object;
};

export default mongoose.model("User", UserSchema);
