import "@strapi/strapi";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as fsSync from "node:fs";

export default ({ strapi }: { strapi: any }) => {
  // registeration phase
  Object.values(strapi.contentTypes).map(async (contentType: any) => {

    if (contentType.uid.includes("api::")) {

      const lifecycle = path.join(
        `${process.cwd()}/src/api/${contentType.apiName}/content-types/${contentType.apiName
        }/lifecycles.ts`
      );

      const fileExist = fsSync.readFileSync(lifecycle).toString().length != 0;

      if ((!contentType.pluginOptions.slug && fileExist)) {

        delete contentType.attributes.slug
        return

      }

      if (!contentType.pluginOptions.slug) {
        return
      }

      // Add tasks property to the content-type
      contentType.attributes.slug = {
        type: "string",
        default: `${contentType.pluginOptions.slug.field}-slug`,
        configurable: false,
      };

      if (fileExist) return;

      const data = `export default {
        beforeCreate(event: any) {
          const { data, where, select, populate } = event.params;

          const slugField = { field: '${contentType.pluginOptions.slug.field}' }

          if(slugField.field) event.params.data.slug = strapi.plugin('slugify').service('slugService').slugify(data, '${contentType.pluginOptions.slug.field}')
    
          return
        },

        beforeUpdate(event: any) {
          const { data, where, select, populate } = event.params;

          const slugField = { field: '${contentType.pluginOptions.slug.field}' }
          if(slugField.field) event.params.data.slug = strapi.plugin('slugify').service('slugService').slugify(data, '${contentType.pluginOptions.slug.field}')

          return
        }
      };`;

      // then create a lifecycle.ts file
      fsSync.writeFileSync(lifecycle, data);

      strapi.reload();
    }


  });
};
