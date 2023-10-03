module.exports= ({strapi}) => ({
    async getList(ctx){
        try {
            const list = await strapi.service('api::type.custom').get_list();
            return list
        } catch (error) {
            console.log(error)
        }
    },

    // async createList(ctx){
    //     const {n}
    // }
})