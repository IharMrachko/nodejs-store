const {body} = require('express-validator/check');

exports.registerValidators = [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({min: 6}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('пароли должны совпадать')
        }
        return true
    })

]
