module.exports = ({ strapi }) => ({
  async getList(ctx) {
    try {
      const { type, name, code } = ctx.request.query;
      const getClothes = await strapi
        .service("api::clothe.custom")
        .get_list({ type, name, code });
      return getClothes;
    } catch (error) {
      return error;
    }
  },

  async createList(ctx) {
    try {
      const {name, code, type, price, description, size, color} = ctx.request.body;
      const createClothes = await strapi
        .service('api::clothe.custom')
        .create_list({name, code, type, price, description, size, color});
      return createClothes;
    } catch (error) {
      return error;
    }
  },

  async deleteList(ctx){
    try {
        const {name, code} = ctx.request.query;
        const removeClothes = await strapi.service('api::clothe.custom').remove_list({name, code})
        return removeClothes;
    } catch (error) {
        
    }
  },

  async updateList(ctx){
    try {
        const {name, code, type, price, description, size, color} = ctx.request.body;
        const updateClothes = await strapi.service('api::clothe.custom').update_list({name, code, type, price, description, size, color});
        return updateClothes;
    } catch (error) {
        return error
    }
  }
});
