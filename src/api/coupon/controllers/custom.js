module.exports= ({strapi}) => ({
    async getList(ctx){
        try {
            const {name, code} = ctx.request.query;
            const list = await strapi.service('api::coupon.custom').get_list({name, code});
            return list
        } catch (error) {
            
        }
    },

    async addCoupon(ctx){
        try {
            const {name, code, clothes} = ctx.request.body;
            const addCoupons = await strapi.service('api::coupon.custom').add_coupon({name, code, clothes});
            return addCoupons;
        } catch (error) {
            console.log(error)
        }
    }
})