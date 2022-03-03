const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

/**
 *
 * @param {Number} size
 * @default 21
 * @returns {Promise<String>} a uniqueid
 */
function createUniqueId(size = 21) {
  return new Promise(async (resolve, reject) => {
    try {
      const uniqueId = await nanoid(size);
      resolve(uniqueId);
    } catch (error) {
      console.log(error);
      reject("Error creating a unique ID");
    }
  });
}

function normalize(string = "") {
  return string.toString().replace(/ /g, "").toLowerCase();
}

module.exports = {
  createUniqueId,
  normalize,
};
