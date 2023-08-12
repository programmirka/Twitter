let _= {};

_.name = () => {
    const regex = "[\-\'A-Za-z0-9 ]+" //we allow: - (hyphen), ' (apostrophe) capital letter, small letters, numbers and whitespace
    const constraints = {
        'presence': {
            allowEmpty: false
        },
        'type': 'string',
        'format': {
            'pattern': regex,
            'flags': 'i',
            'message': "name must match the following patern" + regex
        }
    }
    return constraints;
}
_.email  = () => {
    const constraints = {
        'presence': {
            allowEmpty: false
        },
        'type': 'string',
        'email': true
    }
    return constraints;
}
_.password = () => {
    const constraints = {
        'presence': {
            allowEmpty: false
        },
        'type': "string",
        'length': {
            'minimum': 6
        }

    }
}
module.exports = _;