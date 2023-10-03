module.exports = ({strapi}) => ({
    async getList(ctx){
        try {
            const res = await strapi.service('carousel.custom').get_list();
            return res
        } catch (error) {
            console.log(error);
        }
    }
})