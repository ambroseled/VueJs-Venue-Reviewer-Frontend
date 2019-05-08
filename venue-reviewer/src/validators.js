/**
 *
 *
 */


/**
 * This validator method checks a passed email against the required email pattern
 * @param email the email to be checked
 * @return the result of the validation check
 */ //TODO may not need this
export function isEmail(email) {

}


/**
 * This validator method checks that a username is not already in use
 * @param username the username to check
 */
export function checkUsername(username) {

}


/**
 * This validator method checks that a email is not already in use
 * @param email the email to check
 */
export function checkEmail(email) {

}


/**
 * This validator method checks that at least one of email and password are filled
 * @param email the email to check
 * @param username the username to check
 * @returns {boolean} the result of the check
 */
export function usernameOrEmail(email, username) {
  return !(!email && !username);
}
