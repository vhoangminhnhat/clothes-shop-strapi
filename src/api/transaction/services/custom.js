const _ = require("lodash");
module.exports = ({ strapi }) => ({
  async get_list({ name, code, clothes, fromDate, toDate }) {
    let paramsArray = [];

    /**
     * @param {string} date
     */
    function isValidDateTime(date) {
      // Regex to check valid
      // DateTime(YYYY-MM-DD HH:MM:SS)
      let regex = new RegExp(
        /^([0-9]{4})-((01|02|03|04|05|06|07|08|09|10|11|12|(?:J(anuary|u(ne|ly))|February|Ma(rch|y)|A(pril|ugust)|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)|(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)|(September|October|November|December)|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)))|(january|february|march|april|may|june|july|august|september|october|november|december))-([0-3][0-9])\s([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/
      );
      // if str
      // is empty return false
      if (date == null) {
        return "false";
      }

      // Return true if the str
      // matched the ReGex
      if (regex.test(date) == true) {
        paramsArray.push({ date });
      } else {
        return "false";
      }
    }
    if (name && _.isString(name)) {
      paramsArray.push({ name });
    }
    if (clothes) {
      const clothesList = await strapi.db.query("api::clothe.clothe").findMany({
        where: {
          code: clothes,
        },
      });
      if (clothesList) {
        paramsArray.push({ clothes: clothesList.id });
      }
    }
    if (code && _.isString(code)) {
      paramsArray.push({ code });
    }
    if (fromDate) {
      isValidDateTime(fromDate);
    }
    if (toDate && _.isString(toDate)) {
      isValidDateTime(toDate);
    }
    try {
      const res = await strapi.db
        .query("api::transaction.transaction")
        .findMany({
          where: {
            $and: paramsArray,
          },
          populate: {
            color: true,
            size: true,
          },
        });
      return res;
    } catch (error) {
      console.log(error);
    }
  },

  async create_transaction({
    clothes = [],
    quantity = 0,
    totals = 0,
    user,
    paymentMethod,
    customerName,
    address,
    phoneNumber,
  }) {
    const items = [];
    const clothesInfo = [];

    if (_.isEmpty(clothes)) {
      return { message: "Không có danh sách sản phẩm trong giỏ hàng !" };
    }
    if (!_.isNumber(totals)) {
      return { message: "Giá tiền phải là số !" };
    }
    if (!_.isString(paymentMethod)) {
      return { message: "Phương thức thanh toán phải ở dạng chữ !" };
    };
    if(!_.isString(customerName)){
        return {message: "Tên khách hàng phải là chữ !"}
    };
    if(!_.isString(address)){
        return {message: "Địa chỉ nhận phải là chữ !"}
    }
    if(!_.isString(phoneNumber)){
        return {message: "Dãy số điện thoại phải dưới dạng chuỗi !"}
    }
    if(phoneNumber.length < 10){
        return {message: "Dãy số điện thoại phải đầy đủ 10 số !"}
    }
    if(phoneNumber.length > 10){
        return {message: "Dãy số điện thoại chỉ tồn tại 10 số !"}
    }
    if(_.isEmpty(customerName)){
      return {message: "Tên người nhận không được để trống !"}
    }
    if(_.isEmpty(address)){
      return {message: "Địa chỉ người nhận không được để trống !"}
    }
    if(_.isEmpty(phoneNumber)){
      return {message: "Số điện thoại không được để trống !"}
    }
    // Tìm code dựa theo code của clothes từ body 
    // If true => Lấy dữ liệu size từ db => Kiểm tra xem biến tên size từ body có tồn tại trong size từ db ?
    // If true => Lấy dữ liệu price và quantity từ size ở db
    // If quantity từ clothes trong body - quantity trong size ở db > 0 => Cập nhật lại số lượng trong size ở dc = quantity trong size ở db - quantity từ clothes trong body
    // price = price trong size ở db * quantity từ clothes trong body
    // Update lại clothes trong db sau khi lấy ra quantity
    // Gọi hàm create để tạo transaction.

    for (let i = 0; i < clothes.length; i++) {
      const code = clothes[i].code;
      const findClothes = await strapi.db
        .query("api::clothe.clothe")
        .findOne({
          where: {
            code,
          },
          populate: {
            size: true,
            color: true,
          },
        });
      if (findClothes) {
        //Lấy size trong clothes ở database
        
        const size = _.get(findClothes, "size", []);
        //Filter dữ liệu với tên size trên FE có trùng khớp với tên ở trong size trong clothes không
        const findSize = size.find((dt) => dt.name === clothes[i].size);
        if (findSize) {
          //Lấy giá trị quantity
          const quantityFind = _.get(_.first(findSize), "quantity");
          const price = _.get(_.first(findSize), "price");
          if (quantityFind - clothes[i].quantity > 0) {
            let quantityLeft = quantityFind - clothes[i].quantity;
            totals += price * clothes[i].quantity;
            quantity += clothes[i].quantity;
            findSize["quantity"] = quantityLeft;
            const otherSize = size.find((dt) => dt.name !== clothes[i].size);
            const newSizeArray = otherSize.concat(findSize);
            size.push(newSizeArray);
            const id = _.get(findClothes, "id");
            const res = await strapi.entityService.update(
              "api::clothe.clothe",
              id,
              {
                data: {
                  size: size,
                },
                populate: {
                  size: true,
                },
              }
            );
            if(res){
              clothesInfo.push({
                clothe: id,
                quantity: quantity
              })
            }
          } else {
            return {message: "Số lượng trong kho không đủ !"}
          }
        }
      }
    }
    try {
      const result = await strapi.db.query('api::transaction.transaction').create({
        data: {
          quantity,
          totals,
          customerName,
          paymentMethod,
          phoneNumber,
          user,
          address,
          clothes: clothesInfo
        }
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  },
});
