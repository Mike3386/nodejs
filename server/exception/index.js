"use strict";
exports.exception = class {
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
}