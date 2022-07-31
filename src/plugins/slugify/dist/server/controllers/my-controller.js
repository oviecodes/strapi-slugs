"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@strapi/strapi");
exports.default = ({ strapi }) => ({
    index(ctx) {
        ctx.body = strapi
            .plugin('slugify')
            .service('myService')
            .getWelcomeMessage();
    },
});
