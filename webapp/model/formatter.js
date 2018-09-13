import ValueState from "sap/ui/core/ValueState";

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

function successIfGteElseError(x1, x2){
    try {
        checkNotEmpty(x1);
        checkNotEmpty(x2);
        return defaultNumberStatus(
            parseFloat(x1) - parseFloat(x2)
        );
    } catch (e) {
        return ValueState.None;
    }
}

function invertDefaultNumberStatus(sValue) {
    try {
        checkNotEmpty(sValue);
        return defaultNumberStatus(-parseFloat(sValue));
    } catch (e) {
        return ValueState.None;
    }
}

export default {

    defaultNumberStatus: function(sValue) {
        return defaultNumberStatus(sValue);
    },

    invertDefaultNumberStatus: function(sValue) {
        return invertDefaultNumberStatus(sValue);
    },

    icStatus: function(sValue) {
        return invertDefaultNumberStatus(sValue);
    },

    margemStatus: function(sMargem, sMargemTeorica) {
        return successIfGteElseError(sMargem, sMargemTeorica);
    },

    valorMetaStatus: function(sValue) {
        return defaultNumberStatus(sValue);
    },

    successIfGteElseError: function(x1, x2){
        return successIfGteElseError(x1, x2);
    },

    tipoNegociacaoIcon: function(tipoNegociacaoID){
        switch (tipoNegociacaoID) {
            case 'A':
                return 'sap-icon://table-view';

            case 'B':
                return 'sap-icon://citizen-connect';

            case 'C':
                return 'sap-icon://waiver'

            default:
                return '';                    
        }
    },

    warningIfSecondLowThanFirst: function(firstValue, secondValue) {
        try {
            checkNotEmpty(firstValue);
            checkNotEmpty(secondValue);
            if ( parseFloat(secondValue) < parseFloat(firstValue) )
                return "Warning";
        } catch (e) {
        }
        return "None";
    },

    formatStatusFinancieiro: function(sStatusID) {
        if (sStatusID == 'C')
            return 'Conciliado';
        return 'Não Conciliado';
    },

    toUTC: function(oDate) {
        if (oDate){
            oDate.setFullYear(oDate.getUTCFullYear());
            oDate.setMonth(oDate.getUTCMonth());
            oDate.setDate(oDate.getUTCDate());
            oDate.setHours(oDate.getUTCHours());
        }
        return oDate;
    },

    formatDescricaoItemOrg: function(sTipoNegociacao, sTipoAbrangencia) {
        if (!sTipoNegociacao)
            return;
        if (!sTipoAbrangencia)
            return;
        let oDescricoes = {
            O: {
                U: 'UF',
                G: 'UF',
                L: 'UF',
                },
            I: {
                R: 'Centro Ref.',
                G: 'Loja',
                L: 'Loja',
                },
            F: {
                U: 'UF',
                G: 'Loja',
                L: 'Loja',
                },
            };
        return oDescricoes[sTipoNegociacao][sTipoAbrangencia];
    },

    formatDescricaoItemMerc: function(sTipoNegociacao, sTipoItemMerc) {
        if (!sTipoNegociacao)
            return;
        if (!sTipoItemMerc)
            return;
        let oDescricoes = {
            O: {
                M: 'Mercadoria',
                },
            I: {
                M: 'Mercadoria',
                },
            F: {
                M: 'Mercadoria',
                G: 'Grupo',
                S: 'Seção',
                },
            };
        return oDescricoes[sTipoNegociacao][sTipoItemMerc];
    },

    formatItemMerc: function(sID, sTipoItemMerc) {
        if (!sID)
            return;
        if (!sTipoItemMerc)
            return;
        switch (sTipoItemMerc) {
            case 'S':
                return sID;
            case 'G':
                return sID
            default:
                return sID.replace(/^0*/,"");
        }
   },


    textoPeriodoNegociacao: function(sTipoNegociacao) {
        if (!sTipoNegociacao)
            return;
        let oTextos = {
            O: 'Período de Apuração',
            I: 'Período de Recebimento',
            F: '',
            };
        return oTextos[sTipoNegociacao];
    },

    isNotInitial: function(value){
        if (value)
            return true;
        return false;
    }

}



