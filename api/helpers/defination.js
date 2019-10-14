var mongoose = require('mongoose');

var categoryDefination = {

    _id: {type: String},
        catogeryName:{type: String},


}
var productDefination = {

    _id: {type: String},
        productName:{type: String},
        catogeryId:{type: String},
        catogeryName:{type: String}
        

}


module.exports.categoryDefination = categoryDefination,
module.exports.productDefination = productDefination
