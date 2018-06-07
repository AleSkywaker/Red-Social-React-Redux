const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data){
    console.log(data);
    let errors = {};
 
    data.school = !isEmpty(data.school) ? data.school : "";
    data.degree = !isEmpty(data.degree) ? data.degree : "";
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
    data.from = !isEmpty(data.from) ? data.from : "";

    if(Validator.isEmpty(data.school)){
        errors.school = 'Campo school de trabajo esta vacio'
    }
    if(Validator.isEmpty(data.degree)){
        errors.degree = 'Campo degree esta vacio'
    }
    if(Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = 'Campo fieldofstudy esta vacio'
    }
    if(Validator.isEmpty(data.from)){
        errors.from = 'Campo desde esta vacio'
    }
    return {
        errors, 
        isValid : isEmpty(errors)
    }
}