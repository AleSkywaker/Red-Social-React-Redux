const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data){
    console.log(data);
    let errors = {};
 
    data.title = !isEmpty(data.title) ? data.title : "";
    data.company = !isEmpty(data.company) ? data.company : "";
    data.from = !isEmpty(data.from) ? data.from : "";

    if(Validator.isEmpty(data.title)){
        errors.title = 'Campo titulo de trabajo esta vacio'
    }
    if(Validator.isEmpty(data.company)){
        errors.company = 'Campo empresa esta vacio'
    }
    if(Validator.isEmpty(data.from)){
        errors.from = 'Campo desde esta vacio'
    }
    return {
        errors, 
        isValid : isEmpty(errors)
    }
}