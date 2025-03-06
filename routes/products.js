var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let productModel = require('../schemas/product')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let products = await productModel.find({});
  res.status(200).send({
    success:true,
    data:products
  });
});

router.get('/:id', async function(req, res, next) {
  try {
    let product = await productModel.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!product)
      return res.status(404).send({
        success: false,
        message: "Sản phẩm ko tìm thấy"
      });
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

router.post('/', async function(req, res, next) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price:req.body.price,
      quantity: req.body.quantity,
      category:req.body.category
    })
    await newProduct.save();
    res.status(200).send({
      success:true,
      data:newProduct
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

// PUT: Cập nhật sản phẩm theo id (chỉ cập nhật khi sản phẩm chưa bị soft delete)
router.put('/:id', async function(req, res, next) {
  try {
    let updatedProduct = await productModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category
      },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).send({
        success: false,
        message: "Sản phẩm đã bị xóa"
      });
    res.status(200).send({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

// DELETE: Soft delete sản phẩm theo id (cập nhật isDeleted thành true)
router.delete('/:id', async function(req, res, next) {
  try {
    let deletedProduct = await productModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedProduct)
      return res.status(404).send({
        success: false,
        message: "Sản phẩm đã bị xóa"
      });
    res.status(200).send({
      success: true,
      message: "Sản phẩm được xóa thành công",
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;