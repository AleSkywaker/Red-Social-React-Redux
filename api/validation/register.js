const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data){
    console.log(data);
    let errors = {};
 
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if(!Validator.isLength(data.name, {min:2, max:30})){
        errors.name = 'Nombre debe ser entre 2 y 30 caracteres'
    }
    if(Validator.isEmpty(data.name)){
        errors.name = 'No se puede dejar el campo vacio'
    }
    if(Validator.isEmpty(data.email)){
        errors.email = 'No se puede dejar el campo vacio'
    }
    if(!Validator.isEmail(data.email)){
        errors.email = 'No es un email valido'
    }
    if(Validator.isEmpty(data.password)){
        errors.password = 'No se puede dejar el campo vacio'
    }
    if(Validator.isEmpty(data.password2)){
        errors.password2= 'No se puede dejar el campo vacio'
    }
    if(!Validator.isLength(data.password, {min:6, max:30})){
        errors.password = 'El password debe tener entre 6 y 30 caracteres'
    }
    if(!Validator.isLength(data.password2, {min:6, max:30})){
        errors.password2= 'El password2 debe tener entre 6 y 30 caracteres'
    }
    if(!Validator.equals(data.password, data.password2)){
        errors.password2= 'Las contraseñas deben coincidir'
    }
    return {
        errors, 
        isValid : isEmpty(errors)
    }
}