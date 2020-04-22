const {Router} = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find().populate('userId', 'email name').lean();
    res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  });
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  const course = await Course.findById(req.params.id).lean();
  const courseView = {
    id: course._id,
    title:course.title,
    price: course.price,
    img: course.img
  };


  res.render('course-edit', {
    title: `Редактировать ${courseView.title}`,
    courseView
  })
});

router.post('/edit', auth, async (req, res) => {

  await Course.findByIdAndUpdate({_id: req.body.id}, req.body).lean();
  res.redirect('/courses')
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({_id: req.body.id}).lean();
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById({_id: req.params.id}).lean();
  const courseView = {
      title:course.title,
      price: course.price,
      img: course.img
  };


  res.render('course', {
    layout: 'empty',
    title: `Курс ${courseView.title}`,
    courseView
  })
});

module.exports = router;
