'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (condition, message) {
    if (!condition) console.warn('Warning: ', message);
};