import '@strapi/strapi';
// import axiosInstance from '../../admin/src/utils/axiosInstance';
// import axios from 'axios'
import slugify from 'slugify'

function getPluginStore({ strapi }: { strapi: any }) {
    return strapi.store({
      environment: '',
      type: 'plugin',
      name: 'slugify',
    });
}

async function createDefaultConfig() {
    const pluginStore = getPluginStore({strapi});
    const value = {
        disabled: false,
    };
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
}


export default ({ strapi }: { strapi: any }) => ({
  
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },

  async getSettings() {
    const pluginStore = getPluginStore({strapi});
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig();
    }
    return config;
  },

  async setSettings(settings: any) {
    const value = settings;
    const pluginStore = getPluginStore({strapi});
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
    // return
  },

  async getContentTypes() {
    const contentTypes = strapi.contentTypes
    return Object.values(contentTypes).filter((el: any) => el.uid.includes('api::'))
  },

  async setSlugs(ctx: any, headers:any) {

    let { pluginOptions, info, collectionName, options, attributes, kind  } = ctx

    const toDelete = [ 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'publishedAt', 'slug' ]

    toDelete.map((attr, i) => {
      delete attributes[attr]
    })

    if(ctx.slugEnabled && ctx.slugField) {
      pluginOptions = {
        slug: {
          field: ctx.slugField
        }
      }
    } else {
      pluginOptions = {}
    }

    // delete attributes.createdAt
    // delete attributes.createdBy
    // delete attributes.updatedAt
    // delete attributes.updatedBy
    // delete attributes.publishedAt

    const data: any =  {
      pluginOptions,
      collectionName,
      draftAndPublish: options.draftAndPublish,
      singularName: info.singularName,
      pluralName: info.pluralName,
      attributes,
      displayName: info. displayName,
      kind,
      description: info.description
    }

    console.log(data)

    ctx.request = {
      body: {
        contentType: data,
        components: [] 
      }
    }

    ctx.params = { uid: ctx.uid }

    try {
      strapi.plugin('content-type-builder').controller('content-types').updateContentType(ctx);
    } catch(e) {
      console.log('service', e.errors)
    }

    return

  },

  slugify(ctx: any, field:any) {

    console.log('I am in the slugify service-', 'from slugify')

    return slugify(ctx[field], {
      lower: true
    })
    
  }

});
