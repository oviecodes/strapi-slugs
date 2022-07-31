"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    beforeCreate(event) {
        const { data, where, select, populate } = event.params;
        const slugField = { field: 'Title' };
        if (slugField.field)
            event.params.data.slug = strapi.plugin('slugify').service('slugService').slugify(data, 'Title');
        return;
    },
    beforeUpdate(event) {
        const { data, where, select, populate } = event.params;
        const slugField = { field: 'Title' };
        if (slugField.field)
            event.params.data.slug = strapi.plugin('slugify').service('slugService').slugify(data, 'Title');
        return;
    }
};
