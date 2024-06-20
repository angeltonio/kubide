export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  db: process.env.POSTGRES,
  port: process.env.PORT || 3000,
});
