import { default as axios } from "axios"

/**
 * URL validator for a string
 * @param {string} str - The value to be validate
 * @returns {boolean} A boolean that indicates the string is valid or not
 */
export const validateURL = (str) => {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

/**
 * Simple function to make a http request
 * @param {string} url - A valid URL
 * @param {string} method - HTTP method
 * @param {object} options - Optional option for request
 * @param {boolean} err - Throw an error if set to true
 * @returns {Promise<any>} data from response 
 */
export const fetch = async (url, method = "get", options = {}) => {
  return await new Promise((resolve, reject) => {
      axios({ url, method, ...options }).then((response) => {
          resolve(response.data); 
      }).catch((error) => {
        console.log(error);
        reject(error)
      });
  });
};