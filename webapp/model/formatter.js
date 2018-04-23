
sap.ui.define([
    "sap/ui/core/ValueState",
    ], function (ValueState) {

    "use strict";

    function defaultNumberStatus(sValue) {
        try {
            let fValue = parseFloat(sValue);
            if (fValue < 0) {
                return ValueState.Error;
            } else {
                return ValueState.Success;
            }
        } catch (e) {
            return ValueState.None
        }
    }

    return {

        valorMetaStatus: function(sValue) {
            return defaultNumberStatus(sValue);
        },

    }

});


