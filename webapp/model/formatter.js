
sap.ui.define([
    "sap/ui/core/ValueState",
    ], function (ValueState) {

    "use strict";

    function defaultNumberStatus(sValue) {
        try {
            checkNotEmpty(sValue);
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

    function checkNotEmpty(sValue){
        if (!sValue)
            throw "Empty Value";
    }

    return {

        defaultNumberStatus: function(sValue) {
            return defaultNumberStatus(sValue);
        },

        icStatus: function(sValue) {
            try {
                checkNotEmpty(sValue);
                return defaultNumberStatus(-parseFloat(sValue));
            } catch (e) {
                return ValueState.None;
            }
        },

        margemStatus: function(sMargem, sMargemTeorica) {
            try {
                checkNotEmpty(sMargem);
                checkNotEmpty(sMargemTeorica);
                return defaultNumberStatus(
                    parseFloat(sMargem) - parseFloat(sMargemTeorica)
                );
            } catch (e) {
                return ValueState.None;
            }
        },

        valorMetaStatus: function(sValue) {
            return defaultNumberStatus(sValue);
        },

    }

});


