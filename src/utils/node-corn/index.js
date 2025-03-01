import UserModel from "../../DB/models/User.model.js";
import cron from "node-cron";

// Schedule the cleanup job to run every 6 hours
const scheduleOTPCleanup = () => {
  console.log("Scheduling OTP cleanup job every 6 hours");

  // Schedule using node-cron: '0 */6 * * * *' means at minute 0 past every 6th hour
  cron.schedule("0 */6 * * *", async () => {
    try {
      console.log("Starting OTP cleanup job...");
      const now = new Date();

      // Find all users with expired OTPs and remove them
      // const user = await UserModel.find({});
      // const OtpEntry = user.OTP.find((otp) => otp.expiresIn < now);
      // const result = await UserModel.updateMany(
      //   { "OTP.expiresIn": { $lt: now } },
      //   { $pull: OtpEntry }
      // );

      const result = await UserModel.updateMany(
        { "OTP.expiresIn": { $lt: now } },
        { $pull: { OTP: { expiresIn: { $lt: now } } } }
      );
      console.log(
        `OTP cleanup completed. Modified ${result.modifiedCount} user(s)`
      );
    } catch (error) {
      console.error("Error in OTP cleanup job:", error);
    }
  });
};

export default scheduleOTPCleanup;
