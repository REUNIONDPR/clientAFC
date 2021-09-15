const HAB = {
    "1": { // DTNE
        "catalogue": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }, "formation": {
            "view": true,
            "create": true,
            "update": true,
            "delete": true,
            "validate": true,
        }, "sollicitation": {
            "updateDT": true,
            "updateDDO": false,
            "conv": false,
        }, "adresse": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }
    },
    "2": { // DTSO
        "catalogue": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }, "formation": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }, "sollicitation": {
            "updateDT": true,
            "updateDDO": false,
            "conv": false,
        }, "adresse": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }
    },
    "3": { // DPSR
        "catalogue": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }, "formation": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }, "sollicitation": {
            "updateDT": false,
            "updateDDO": false,
            "conv": true,
        }, "adresse": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }
    },
    "4": { // JURIDIQUE
        "catalogue": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }, "formation": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }, "sollicitation": {
            "updateDT": false,
            "updateDDO": false,
            "conv": false,
        }, "adresse": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }
    },
    "5": { // DDO
        "catalogue": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }, "formation": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }, "sollicitation": {
            "updateDT": false,
            "updateDDO": true,
            "conv": false,
        }, "adresse": {
            "view": true,
            "create": false,
            "update": false,
            "delete": false,
            "validate": false,
        }
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
        }
    },
}

export default HAB