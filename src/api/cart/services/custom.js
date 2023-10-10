const _ = require("lodash");

module.exports = ({ strapi }) => ({
  async add_to_cart ({code, quantity, color, size}) {
    let array = [];
    if(_.isEmpty(code)) {
      return {messege: "Code must not be empty !"}
    };

    if (quantity <= 0) {
      return {messege: "Quantity must be positive !"}
    };

    if(!_.isString(color)){
      return {messege: "Color must be a String !"}
    };

    if(!_.isString(size)) {
      return {messege: "Size must be a String !"}
    };

    const checkCode = await strapi.db.query('api::clothe.clothe').findOne({
      where: {
        code: code,
      },
      populate: {
        quantity: {
          populate: {
            color: true,
            size: true
          }
        }
      }
    });

    if(checkCode) {
      const checkColor = await strapi.db.query('api::color.color').findOne({
        where: {
          code: color
        }
      });

      const checkSize = await strapi.db.query('api::size.size').findOne({
        where: {
          code: size
        }
      });

      if(!checkColor) {
        return {messege: "Color does not exist !"}
      };

      if (!checkSize) {
        return {messege: "Size does not exist !"}
      };

      const colorName = _.get(checkColor, "name");
      const sizeName = _.get(checkSize, "name");
      try {
        const res = await strapi.db.query('api::cart.cart').create({
          data: {
            name: _.get(checkCode, "name"),
            code: code,
            quantity: quantity,
            size: sizeName,
            color: colorName,
            clothes: _.get(checkCode, "id")
          },
          populate: {
            clothes: {
              populate: {
                quantity: {
                  populate: {
                    color: true,
                    size: true
                  }
                }
              }
            }
          }
        });
        return res;
      } catch (error) {
        console.log(error)
      }
    }
  },

  async delete_cart_items({ code }) {
    if (_.isEmpty(code)) {
      return { message: "Code must not be empty !" };
    }
    if (!_.isEmpty(code)) {
      try {
        const checkCode = await strapi.db.query("api::cart.cart").findOne({
          where: {
            code: code,
          },
        });
        if (checkCode) {
          const res = await strapi.db.query("api::cart.cart").delete({
            where: {
              code: code,
            },
          });
          if (res) {
            return { message: "Xóa thành công" };
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  },

  async update_cart({ code, size, color, quantity }) {
    if (_.isEmpty(code)) {
      return { message: "Code must not be empty !" };
    }
    if (!_.isEmpty(code) && !_.isString(code)) {
      return { message: "Code must be a String !" };
    }
    if (!_.isEmpty(code) && _.isString(code)) {
      const checkCode = await strapi.db.query("api::cart.cart").findOne({
        where: {
          code: code,
        },
        populate: {
          clothes: true,
        },
      });
      if (checkCode) {
        const checkClothes = await strapi.db
          .query("api::clothe.clothe")
          .findOne({
            where: {
              code: code,
            },
            populate: {
              color: {
                populate: {
                  size: true,
                },
              },
            },
          });
        const id = _.get(checkCode, "id");
        if (checkClothes) {
          const colorArr = _.get(checkCode, "color", []);
          if (!_.isEmpty(colorArr)) {
            const colors = colorArr.find((val) => val.code === color);
            if (colors) {
              const sizeArr = _.get(_.first(colorArr), "size", []);
              if (!_.isEmpty(sizeArr)) {
                const sizeValue = sizeArr.find((val) => val.name === size);
                const quantityValue = _.get(sizeValue, "quantity");
                if (quantityValue - quantity > 0) {
                  try {
                    const res = await strapi.db.query("api::cart.cart").update({
                      where: {
                        id: id,
                      },
                      data: {
                        code: code,
                        size: size,
                        color: color,
                        quantity: quantity,
                        clothes: checkCode,
                      },
                      populate: {
                        clothes: true,
                      },
                    });
                    return res;
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  async get_carts({code, size, color, quantity}){
    let params = [];
    if(_.isEmpty(code)){
      return {message: "Code must not be empty !"}
    }
    if(_.isEmpty(size)){
      return {message: "Size must not be empty !"}
    }
    if(_.isEmpty(color)){
      return {message: "Color must not be empty !"}
    }
    if(quantity <= 0){
      return {message: "Quantity must be positive"}
    }
    if(_.isString(code)){
      params.push({code})
    }
    if(_.isString(size)){
      params.push({size});
    }
    if(_.isString(color)){
      params.push({color})
    };
    if(_.isNumber(quantity) && quantity > 0){
      params.push({quantity})
    };
    try {
      const list = await strapi.db.query('api::cart.cart').findMany({
        where: {
          $and: params 
        },
        populate: {
          clothes: true
        }
      });
      return list;
    } catch (error) {
      console.log(error);
    }
  }
});
