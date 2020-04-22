const {Schema, model} = require('mongoose');

const userSchema = new Schema({
   email: {
       type: String,
       required: true
   },
    name: String,
    password: {
        type: String,
        required: true
    },
    cart: {
       items: [
           {
               count: {
                   type: Number,
                   required: true,
                   default: 1
               },
               courseId: {
                   type: Schema.Types.ObjectID,
                   ref: 'Course',
                   required: true

               }
           }
       ]
    }
});

userSchema.methods.addToCart = function (course) {
    console.log(course);
   const clonedItems = [...this.cart.items];
   const idx = clonedItems.findIndex(c => {
       return c.courseId.toString() === course._id.toString()
   });
   if (idx >=0) {
       clonedItems[idx].count = clonedItems[idx].count + 1;
   } else {
       clonedItems.push({
           courseId: course._id,
           count: 1
       });
   }

   const newCart = {items: clonedItems};
   this.cart = newCart;
   return this.save();
};

userSchema.methods.removeFromCart = function (id) {
    console.log(id);
    let items = [...this.cart.items];
    const idx = items.findIndex(c => c.courseId.toString() === id.toString());

    if (items[idx].count === 1) {
       items = items.filter(c => c.courseId.toString() !== id.toString())
    } else {
        items[idx].count --
    }

    this.cart = {items};
    return this.save

};

userSchema.methods.clearCart = function() {
    this.cart = {items: []};
    return this.save();
};
module.exports = model('User', userSchema);
