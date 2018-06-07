const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
    console.log(data);
    let errors = {};
 
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if(!Validator.isEmail(data.email)){
        errors.email = 'No es un email valido'
    }
    if(Validator.isEmpty(data.email)){
        errors.email = 'No se puede dejar el campo vacio'
    }
    if(Validator.isEmpty(data.password)){
        errors.password = 'No se puede dejar el campo vacio'
    }
    return {
        errors, 
        isValid : isEmpty(errors)
    }
}