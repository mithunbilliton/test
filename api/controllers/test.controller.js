"use strict";
var Mongoose = require("mongoose"),
    SMCrud = require("swagger-mongoose-crud"),
   //log4js = require("cuti").logger.getLogger,
   url = process.env.MONGO_URL ? process.env.MONGO_URL : "mongodb://localhost/test",
    logger = "systemTest",
    http = require("http"),
   // cuti = require("cuti"),

    categoryDefinition = require("../helpers/defination").categoryDefination,
    productdefination = require("../helpers/defination").productDefination,
    categorySchema = new Mongoose.Schema(categoryDefinition),
    productSchema = new Mongoose.Schema(productdefination),
    categoryCollection = "category",
    productCollection = "product";
    let categoryCrudder = new SMCrud(categorySchema, categoryCollection, logger);
    let productCrudder = new SMCrud(productSchema, productCollection, logger);
   var mongoDB = 'mongodb://127.0.0.1/test';
Mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = Mongoose.connection;




// categorySchema.pre('save', function (next) {
//     var self = this;
//     if (!self._id) {
//         self._id = cuti.counter.getCount(categoryCollection, null, function (err, doc) {
//             if (!err) {
//                 self._id = "CAT" + doc.next;
//                 next();
//             } else {
//                 next(err);
//             }
//         });
//     } else {
//         next();
//     }
// });

// productSchema.pre('save', function (next) {
//     var self = this;
//     if (!self._id) {
//         self._id = cuti.counter.getCount(productCollection, null, function (err, doc) {
//             if (!err) {
//                 self._id = "PRO" + doc.next;
//                 next();
//             } else {
//                 next(err);
//             }
//         });
//     } else {
//         next();
//     }
// });
productSchema.pre('save',function(next){
    var self = this;
    if(!self.categoryId){
        categoryCrudder.model.find({"_id":self.categoryId}, (err,doc) =>{
            self.categoryId = doc[0].categoryId
            self.categoryName = doc[0].categoryName
        })
        next();
    }else{
        next();
    }

})



function patchCategory(req, res) {
    var params = categoryCrudder.swagMapper(req);
    var id = params.id;
    var body = categoryCrudder.swagMapper(req).data;
    categoryCrudder.model.update({ "_id": id }, { $set: body }).then(doc => {
        if (doc) {
            res.status(200).send(doc);
        } else {

            res.status(400).send({ "message": "data not updated" });
        }

    })
}


function patchProduct(req, res) {
    var params = productCrudder.swagMapper(req);
    var id = params.id;
    var body = productCrudder.swagMapper(req).data;
    productCrudder.model.update({ "_id": id }, { $set: body }).then(doc => {
        if (doc) {
            res.status(200).send(doc);
        } else {

            res.status(400).send({ "message": "data not updated" });
        }

    })
}


function createCategory(req,res){
   var  body = req.swagger.params.data.value;
   console.log(body);
   db.collection(categoryCollection,(err, collection)=>{
       collection.insert(body,(err,doc)=>{
           console.log("doccccccc");
           if(err){
               res.status(400).send(err)
           }else(
               res.status(200).send(doc)
           )
          
       })

   })
  // res.status(200).send({"message":"successful"}) 
}


module.exports = {

    //category

    v1_createCategory:createCategory,
    // v1_fetchCategory: categoryCrudder.index,
    // v1_fetchCategoryById: categoryCrudder.show,
    // v1_updateCategory: categoryCrudder.update,
    // v1_categoryCount: categoryCrudder.count,
    // v1_deleteCategory: categoryCrudder.markAsDeleted,
    // v1_updateCategoryPatch: patchCategory,

    // //product

    // v1_createProduct: productCrudder.create,
    // v1_fetchProdct: productCrudder.index,
    // v1_fetchProductById: productCrudder.show,
    // v1_updateProduct: productCrudder.update,
    // v1_productCount: productCrudder.count,
    // v1_deleteProduct: productCrudder.markAsDeleted,
    // v1_updateProductPatch: patchProduct,


};