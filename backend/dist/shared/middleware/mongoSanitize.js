"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoSanitize = void 0;
const hasInjection = (obj) => {
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            }
            else if (typeof obj[key] === 'object') {
                hasInjection(obj[key]);
            }
        }
    }
    return obj;
};
const mongoSanitize = (req, res, next) => {
    req.body = hasInjection(req.body);
    req.query = hasInjection(req.query);
    req.params = hasInjection(req.params);
    next();
};
exports.mongoSanitize = mongoSanitize;
exports.default = exports.mongoSanitize;
