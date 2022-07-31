export default {
  beforeCreate(event: any) {
    const { data, where, select, populate } = event.params;

    const slugField = { field: 'title' }

    if (slugField.field) event.params.data.slug = strapi.plugin('slugify').service('slugService').slugify(data, 'title')

    return
  },

  beforeUpdate(event: any) {
    const { data, where, select, populate } = event.params;

    const slugField = { field: 'title' }
    if (slugField.field) event.params.data.slug = strapi.plugin('slugify').service('slugService').slugify(data, 'title')

    return
  }
};