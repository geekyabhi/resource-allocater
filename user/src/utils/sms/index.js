const fast2sms = require("fast-two-sms");

const { FAST2SMS } = require("../../config/");

const sendMessage = ({ number, message }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(number);
      console.log(message);

      const res = await fast2sms.sendMessage({
        authorization: FAST2SMS,
        message: message,
        numbers: [number],
      });

      resolve(res);
    } catch (e) {
      reject(`Error while sending message :${e}`);
    }
  });
};

module.exports = { sendMessage };
