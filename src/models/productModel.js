import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  priceCOP: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Other', 'Shirts'],
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [String],
  sizes: [String],
  colors: [String],
  discount: {
    value: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },
    startDate: Date,
    endDate: Date,
  },
}, { timestamps: true });

// Índice compuesto para consultas frecuentes
productSchema.index({ category: 1, priceCOP: -1 });

productSchema.methods.applyDiscount = function () {
  const now = new Date();
  if (this.discount.startDate && this.discount.endDate) {
    if (now >= this.discount.startDate && now <= this.discount.endDate) {
      const discountAmount = this.priceCOP * (this.discount.value / 100);
      return this.priceCOP - discountAmount;
    }
  }
  return this.priceCOP;
};

const Product = mongoose.model('Product', productSchema);

export default Product;
