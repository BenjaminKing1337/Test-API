const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let toolsSchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        img: {type: String, required: true},
        type: {type: String, required: true},
        price: {type: Number, required: true},
        inStock: {type: Boolean, required: true}
    }
);

toolsSchema.pre('findOneAndUpdate', function() {
    const update = this.getUpdate();
    if (update.__v != null) {
      delete update.__v;
    }
    const keys = ['$set', '$setOnInsert'];
    for (const key of keys) {
      if (update[key] != null && update[key].__v != null) {
        delete update[key].__v;
        if (Object.keys(update[key]).length === 0) {
          delete update[key];
        }
      }
    }
    update.$inc = update.$inc || {};
    update.$inc.__v = 1;
  });


module.exports = mongoose.model("tools", toolsSchema);