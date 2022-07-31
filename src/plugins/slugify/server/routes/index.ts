export default [
  {
    method: 'GET',
    path: '/',
    handler: 'slugController.index',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/settings',
    handler: 'slugController.getSettings',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'slugController.setSettings',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/allContentTypes',
    handler: 'slugController.getContentTypes',
    config: {
      policies: [],
      auth: false,
    }
  },
  {
    method: 'POST',
    path: '/setSlugs',
    handler: 'slugController.setSlugs',
    config: {
      policies: [],
      auth: false,
    }
  }
];
