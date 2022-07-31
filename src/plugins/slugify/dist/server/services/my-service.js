"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@strapi/strapi");
exports.default = ({ strapi }) => ({
    getWelcomeMessage() {
        return 'Welcome to Strapi 🚀';
    },
});
