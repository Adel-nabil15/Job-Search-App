import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "djduppeni",
  api_key: "566945169593845",
  api_secret: process.env.CLOUD,
});

export default cloudinary;
