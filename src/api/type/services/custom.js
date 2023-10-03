const _ = require('lodash');
module.exports = ({strapi}) => ({
    async get_list(){
        try {
            const list = await strapi.db.query('api::type.type').findMany({})
            return list
        } catch (error) {
            console.log(error)
        }
        
    },
})