const {Router} = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res)=> {
   try {

       const orders = await Order.find({
           'user.userId': req.user._id
       }).populate('user.userId').lean();

       const ordersMap = orders.map(o => {
          return {
              name: o.user.name,
              coursesPrice: o.courses[0].course.price * o.courses[0].count,
              coursesTitle: o.courses[0].course.title,
              data: o.date}
       });

       res.render('orders', {
           isOrder: true,
           title: 'Заказы',
           ordersMap
       })
   } catch (e) {
       console.log(e);
   }

});

router.post('/', auth, async (req, res) => {
  try {
      const user = await req.user
          .populate('cart.items.courseId')
          .execPopulate();
      const courses = user.cart.items.map(i => ({
          count: i.count,
          course: {...i.courseId._doc}
      }));
      const order = new Order({
          user: {
              name: req.user.name,
              userId: req.user
          },
          courses: courses
      });

      await order.save();
      await req.user.clearCart();

      res.redirect('/orders')
  } catch (e) {
      console.log(e);
  }


});
module.exports = router;
