import bcrypt from "bcryptjs";

export const hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePasswords = async function (plain, hashed) {
  const isPassword = await bcrypt.compare(plain, hashed);

  return isPassword;
};
