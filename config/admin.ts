export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'ab9929c75b31a1a2cd4a819d50be9132'),
  },
});
