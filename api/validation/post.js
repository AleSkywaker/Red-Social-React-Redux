const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data){
    console.log(data);
    let errors = {};
 
    data.text = !isEmpty(data.text) ? data.text : "";

    if(!Validator.isLength(data.text, {min:5, max: 300})) {
        errors.text = 'Post debe tener entre 10 y 300 caracteres'
    }
    
    if(Validator.isEmpty(data.text)){
        errors.text = 'El campo texto no puede estar vacio'
    }
    
    return {
        errors, 
        isValid : isEmpty(errors)
    }
}