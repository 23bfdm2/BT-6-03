var express = require('express');
var router = express.Router();
var Category = require('../schemas/category');
router.get('/', async function(req, res) {
  try {
    let categories = await Category.find({});
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:id', async function(req, res) {
  try {
    let category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy"
      });
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/', async function(req, res) {
  try {
    let newCategory = new Category({
      name: req.body.name,
      description: req.body.description
    });
    await newCategory.save();
    res.status(201).json({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/:id', async function(req, res) {
  try {
    let updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description
      },
      {
        new: true
      }
    );
    if (!updatedCategory)
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy"
      });
    res.status(200).json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE: Xóa category theo id
router.delete('/:id', async function(req, res) {
  try {
    let deletedCategory = await Category.findByIdAndRemove(req.params.id);
    if (!deletedCategory)
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy"
      });
    res.status(200).json({
      success: true,
      message: "Đã xóa thành công",
      data: deletedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;