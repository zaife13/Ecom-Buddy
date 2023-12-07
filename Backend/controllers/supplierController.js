const Supplier = require('../models/supplierModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.addSupplier = catchAsync(async (req, res, next) => {
  const supplier = new Supplier(req.body);
  await supplier.save();

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { suppliers: supplier._id } },
    { new: true }
  );
  return res.status(200).json({
    status: 'success',
    user,
  });
});

exports.getSuppliers = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('suppliers');
  res.status(200).json({
    status: 'success',
    results: user.suppliers.length,
    data: {
      suppliers: user.suppliers,
    },
  });
});

exports.removeSupplier = catchAsync(async (req, res, next) => {
  await Supplier.findByIdAndDelete(req.params.supplierId);
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { suppliers: req.params.supplierId } },
    { new: true }
  );

  user = await user.populate('suppliers');

  res.status(200).send({
    status: 'success',
    data: {
      suppliers: user.suppliers,
    },
  });
});
