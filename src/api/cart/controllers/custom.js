module.exports = ({strapi}) => ({
    async getList(ctx){
        try {
            const {code, size, color, quantity} = ctx.request.params;
            const getCarts = await strapi.service('api::cart.custom').get_carts({code, size, color, quantity});
            return getCarts;
        } catch (error) {
            console.log(error)
        }
    },

    async createCart(ctx){
        try {
            const {code, size, color, quantity} = ctx.request.body;
            const createCarts = await strapi.service('api::cart.custom').add_to_cart({code, size, color, quantity})
            return createCarts;
        } catch (error) {
            console.log(error)
        }
    },

    async deleteCart(ctx){
        try {
            const {code} = ctx.request.body;
            const deleteCarts = await strapi.service('api::cart.custom').delete_cart_items({code});
            return deleteCarts
        } catch (error) {
            console.log(error)
        }
    },

    async updateCart(ctx){
        try {
            const {code, size, color, quantity} = ctx.request.body;
            const updateCarts = await strapi.service('api::cart.custom').update_cart({code, size, color, quantity});
            return updateCarts;
        } catch (error) {
            console.log(error);
        }
    }

})