import { ValidationError, WrongSessionKey, WrongCredentials } from "./customErrors.js";

class textCheck {

    // checks if inputs are not allowed
    // so returns true if input is not allowed
    static checkInputs(username, email, userpw) {
        return textCheck.checkInput(username) ||
            textCheck.checkInput(email) ||
            textCheck.checkInput(userpw);
    }

    static checkInput(input) {
        // = is not important for mongodb as far as i know, but maybe will switch to sql at some point who knows
        return input.includes("admin") || input.includes("=");
    }

    static checkEMailInput(email) {
        return !(email.includes("@") && email.includes("."));
    }
}

export default textCheck;