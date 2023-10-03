module.exports = ({strapi}) => ({
    async get_list(){
        try {
            const res = await strapi.db.query('api::carousel.carousel').findMany({
                where: {}
            });
            return res
        } catch (error) {
            console.log(error)
        }
    }
})