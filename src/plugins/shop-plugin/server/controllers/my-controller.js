'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('shop-plugin')
      .service('myService')
      .getWelcomeMessage();
  },
});
