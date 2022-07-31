"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@strapi/strapi");
// import axiosInstance from '../../admin/src/utils/axiosInstance';
// import axios from 'axios'
const slugify_1 = __importDefault(require("slugify"));
function getPluginStore({ strapi }) {
    return strapi.store({
        environment: '',
        type: 'plugin',
        name: 'slugify',
    });
}
async function createDefaultConfig() {
    const pluginStore = getPluginStore({ strapi });
    const value = {
        disabled: false,
    };
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
}
exports.default = ({ strapi }) => ({
    getWelcomeMessage() {
        return 'Welcome to Strapi 🚀';
    },
    async getSettings() {
        const pluginStore = getPluginStore({ strapi });
        let config = await pluginStore.get({ key: 'settings' });
        if (!config) {
            config = await createDefaultConfig();
        }
        return config;
    },
    async setSettings(settings) {
        const value = settings;
        const pluginStore = getPluginStore({ strapi });
        await pluginStore.set({ key: 'settings', value });
        return pluginStore.get({ key: 'settings' });
        // return
    },
    async getContentTypes() {
        const contentTypes = strapi.contentTypes;
        return Object.values(contentTypes).filter((el) => el.uid.includes('api::'));
    },
    async setSlugs(ctx, headers) {
        let { pluginOptions, info, collectionName, options, attributes, kind } = ctx;
        const toDelete = ['createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'publishedAt', 'slug'];
        toDelete.map((attr, i) => {
            delete attributes[attr];
        });
        if (ctx.slugEnabled && ctx.slugField) {
            pluginOptions = {
                slug: {
                    field: ctx.slugField
                }
            };
        }
        else {
            pluginOptions = {};
        }
        // delete attributes.createdAt
        // delete attributes.createdBy
        // delete attributes.updatedAt
        // delete attributes.updatedBy
        // delete attributes.publishedAt
        const data = {
            pluginOptions,
            collectionName,
            draftAndPublish: options.draftAndPublish,
            singularName: info.singularName,
            pluralName: info.pluralName,
            attributes,
            displayName: info.displayName,
            kind,
            description: info.description
        };
        console.log(data);
        ctx.request = {
            body: {
                contentType: data,
                components: []
            }
        };
        ctx.params = { uid: ctx.uid };
        try {
            strapi.plugin('content-type-builder').controller('content-types').updateContentType(ctx);
        }
        catch (e) {
            console.log('service', e.errors);
        }
        return;
    },
    slugify(ctx, field) {
        console.log('I am in the slugify service-', 'from slugify');
        return (0, slugify_1.default)(ctx[field], {
            lower: true
        });
    }
});
