const HAB = {
    "1": { // DTNE
        "catalogue": {
            "view": true,
        }, "formation": {
            "view": true,
            "create": true,
            "update": true,
            "delete": true,
            "validate": true,
        }, "sollicitation": {
            "create":true,
            "updateDT": true,
        }, "adresse": {
            "view": true,
        }
    },
    "2": { // DTSO
        "catalogue": {
            "view": true,
        }, "formation": {
            "view": true,
            "create": true,
            "update": true,
            "delete": true,
            "validate": true,
        }, "sollicitation": {
            "create":true,
            "updateDT": true,
        }, "adresse": {
            "view": true,
        }
    },
    "3": { // DPSR
        "catalogue": {
            "view": true,
        }, "formation": {
            "view": true,
        }, "sollicitation": {
            "conv": true,
        }, "adresse": {
            "view": true,
        }, "brs" : {
            "view":true,
        }
    },
    "4": { // JURIDIQUE
        "catalogue": {
            "view": true,
            "create": true,
            "update": true,
            "delete": true,
            "validate": true,
        }, "bdd": {
            "view": true,
        }, "formation": {
            "view": true,
        }, "adresse": {
            "view": true,
            "crud": true,
        }
    },
    "5": { // DDO
        "catalogue": {
            "view": true,
        }, "formation": {
            "view": true,
        }, "sollicitation": {
            "updateDDO": true,
        }, "adresse": {
            "view": true,
        }, "brs": {
            "create": true,
            "view": true,
        },
    },
    "6": { // DPR
        "catalogue": {
            "view": true,
            "create": true,
            "update": true,
            "delete": true,
            "validate": true,
        }, "formation": {
            "view": true,
            "create": true,
            "update": true,
            "delete": true,
            "validate": true,
        }, "sollicitation": {
            "updateDT": true,
            "updateDDO": true,
            "conv": true,
        }, "adresse": {
            "view": true,
            "create": true,
            "update": true,
            "delete": true,
            "validate": true,
        }, "brs": {
            "create": true,
        }, "admin": {
            'view': true,
        }, "bdd": {
            "view": true,
        }
    },
}

export default HAB