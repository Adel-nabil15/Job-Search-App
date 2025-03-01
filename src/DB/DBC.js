import mongoose from "mongoose";

const DBC = async () => {
  mongoose
    .connect(process.env.DBC)
    .then(() => {
      console.log("DBC is work");
    })
    .catch((error) => {
      console.log(`There is Error in DBC`, error);
    });
};

export default DBC;
