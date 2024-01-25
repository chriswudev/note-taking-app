export const getJwtSecretKey = () => {
  return process.env.JWT_SECRET || "my_jwt_secret_key";
};
