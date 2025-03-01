import { nanoid, customAlphabet } from "nanoid";
import { HASH } from "../Hash/hach.js";
import Send_Email from "../../service/SEND_EMAIL.js";
import UserModel from "../../DB/models/User.model.js";
import { OTPtypes } from "../enumTypes.js";
import EventEmitter from "nodemailer/lib/xoauth2/index.js";

export const eventEmiteer = new EventEmitter();

// -------------- signUp otp -------------------------
eventEmiteer.on("SendOTP", async (data) => {
  const { email } = data;
  const otp = customAlphabet("123456789", 5)();
  const hashotp = await HASH({ key: otp, saltOrRounds: 8 });
  await UserModel.findOneAndUpdate(
    { email },
    {
      OTP: [
        {
          code: hashotp,
          type: OTPtypes.C_email,
          expiresIn: new Date(Date.now() + 10 * 60 * 1000), 
        },
      ],
    },

    { new: true }
  );
  Send_Email(email, "Confirm Email", ` <h1>${otp}</h1>`);
});


// -------------- ForgetPassOTP -------------------------
eventEmiteer.on("ForgetPassOTP", async (data) => {
  const { email } = data;
  const otp = customAlphabet("123456789", 5)();
  const hashotp = await HASH({ key: otp, saltOrRounds: 8 });
  await UserModel.findOneAndUpdate(
    { email },
    {
      OTP: [ 
        {
          code: hashotp,
          type: OTPtypes.F_password,
          expiresIn: new Date(Date.now() + 10 * 60 * 1000), 
        },
      ],
    },

    { new: true }
  );
  Send_Email(email, "Forget password Code", ` <h1>${otp}</h1>`);
});

