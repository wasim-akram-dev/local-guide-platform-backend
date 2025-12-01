import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND as string,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET as string,
    access_expires: process.env.JWT_ACCESS_EXPIRES as string,
    refresh_secret: process.env.JWT_REFRESH_SECRET as string,
    refresh_expires: process.env.JWT_REFRESH_EXPIRES as string,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  openRouterApiKey: process.env.OPEN_ROUTER_API_KEY,
};
