const fpe = require('node-fpe');

module.exports = function (scrambler = 'password') {
  const cipher = fpe({ password: scrambler });

  function generateTripId(date) {
    let now = date
      ? new Date(date).getTime().toString()
      : Date.now().toString();

    // pad with additional random digits
    if (now.length < 14) {
      const pad = 14 - now.length;
      now += randomNumber(pad);
    }
    now = cipher.encrypt(now);

    return [now.slice(4, 6), now.slice(8, 10)].join('');  // xxxxxxxx format
  }

  function getTime(id) {
    let res = id.replace(/-/g, '');
    res = res.slice(0, 13);
    res = cipher.decrypt(res);
    res = parseInt(res, 10);
    return res;
  }

  return { generateTripId, getTime };
};

function randomNumber(length) {
  return Math.floor(
    Math.pow(10, length - 1) +
    Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  ).toString();
}