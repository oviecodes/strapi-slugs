"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@strapi/strapi");
const path = __importStar(require("node:path"));
const fsSync = __importStar(require("node:fs"));
exports.default = ({ strapi }) => {
    // registeration phase
    Object.values(strapi.contentTypes).map(async (contentType) => {
        // console.log(contentType)
        // console.log(Object.keys(contentType))
        // If this is an api content-type
        // if (contentType.uid.includes("plugin::")) {
        //   console.log(contentType.uid);
        // }
        if (contentType.uid.includes("api::")) {
            const lifecycle = path.join(`${process.cwd()}/src/api/${contentType.apiName}/content-types/${contentType.apiName}/lifecycles.ts`);
            const fileExist = fsSync.readFileSync(lifecycle).toString().length != 0;
            if ((!contentType.pluginOptions.slug && fileExist)) {
                delete contentType.attributes.slug;
                return;
            }
            if (!contentType.pluginOptions.slug) {
                return;
            }
            // then create a lifecycle.ts file
            console.log(`isEmpty-${contentType.apiName}`, fileExist);
            // Add tasks property to the content-type
            contentType.attributes.slug = {
                type: "string",
                default: `${contentType.pluginOptions.slug.field}-slug`,
                configurable: false,
            };
            // return
            if (fileExist)
                return;
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
            fsSync.writeFileSync(lifecycle, data);
            strapi.reload();
            // let name = `/home/phantom/Documents/strapi-projects/slugify/src/api/article/content-types/article/lifecycles.ts`
        }
    });
};
