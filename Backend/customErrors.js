class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

class WrongSessionKey extends Error {
    constructor(message) {
        super(message);
        this.name = "WrongSessionKey";
    }
}

class WrongCredentials extends Error {
    constructor(message) {
        super(message);
        this.name = "WrongCredentials";
    }
}

export { ValidationError, WrongSessionKey, WrongCredentials };