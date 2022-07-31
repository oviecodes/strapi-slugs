"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;
        const slugField = { field: 'title' };
        if (slugField.field)
            event.params.data.slug = strapi.plugin('slugify').service('slugService').slugify(data, 'title');
        return;
    },
    beforeUpdate(event) {
        const { data, where, select, populate } = event.params;
        const slugField = { field: 'title' };
        if (slugField.field)
            event.params.data.slug = strapi.plugin('slugify').service('slugService').slugify(data, 'title');
        return;
    }
};
