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
            P: {
                U: 'UF',
                G: 'UF',
                L: 'UF',
            },
            C: {
                R: 'Centro Ref.',
                G: 'Centro Ref.',
                L: 'Centro Ref.',
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
            P: {
                M: 'Mercadoria',
                G: 'Grupo',
                S: 'Seção',
            },
            C: {
                M: 'Mercadoria',
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
            C: 'Validade Custo',
            };
        return oTextos[sTipoNegociacao];
    },

    isNotInitial: function(value){
        if (value)
            return true;
        return false;
    },

    isInitial: function(value){
        if (value)
            return false;
        return true;
    },

    isZero: function(value){
        return parseFloat(value) == 0;
    },

    isNotZero: function(value){
        return parseFloat(value) != 0;
    },

    nomeMinutaPDF: function(sBandeiraID, sFornecedorID){
        let oData = new Date();
        let sData = oData.toISOString().split('T')[0].replace(/-/g,''); // yyyymmdd
        return `Acordo Comercial Extra_${sBandeiraID}_${sFornecedorID}_${sData}.pdf`;
    },

    lowercase: function(value){
        if (value)
            return value.toLowerCase();
        return value;
    },

    colunaAnexosEstipulacaoVisivel: function(sTipoNegociacao){
        return (['O', 'I', 'F'].indexOf(sTipoNegociacao) >= 0);
    },

    colunaAnexosVisivel: function(sTipoNegociacao){
        return (['P'].indexOf(sTipoNegociacao) >= 0);
    },    

    colunaEstipulacaoVisivel: function(sTipoNegociacao){
        return (['O', 'I', 'F'].indexOf(sTipoNegociacao) >= 0);
    },

    apuracaoDeLabel: function(sTipoNegociacao){

        switch (sTipoNegociacao) {
            case 'O':
            case 'I':
            case 'F':
                return 'Vencimento';
            
            case 'C':
                return 'Vigência De';

            default:
                return '';
        }

    },


    apuracaoAteLabel: function(sTipoNegociacao){

        switch (sTipoNegociacao) {
            case 'O':
            case 'I':
            case 'F':
                return 'Vencimento';
            
            case 'C':
                return 'Vigência Até';
            case 'P':
                return 'Vigência Até';

            default:
                return '';
        }

    },

    bonificacaoVisivel: function(sTipoNegociacao){
        return (['O', 'I', 'F'].indexOf(sTipoNegociacao) >= 0);
    },

    apuracaoDeVisible: function(sTipoNegociacao) {
        return (['C', ].indexOf(sTipoNegociacao) >= 0);
    },

    colunaStatusVisivel: function(sTipoNegociacao){
        return (['O', 'I', 'F', 'C'].indexOf(sTipoNegociacao) >= 0);
    },    

    colunaComentarioVisivel: function(sTipoNegociacao){
        return (['P'].indexOf(sTipoNegociacao) >= 0);
    },    

    colunaBandeiraVisivel: function(sTipoNegociacao){
        return (['P'].indexOf(sTipoNegociacao) >= 0);
    }, 
    
    botaoConcluirVisivel: function(isEditavel, sTipoNegociacao){
        if (['O', 'I', 'F', 'C'].indexOf(sTipoNegociacao) >= 0){
            return isEditavel;
        }
        else{
            return false;
        }
    }, 

    infoGeralPrazPagVisivel: function(sTipoNegociacao){
        return (['P'].indexOf(sTipoNegociacao) >= 0);
    },

    infoGeralVisivel: function(sTipoNegociacao){
        return (['O', 'I', 'F', 'C'].indexOf(sTipoNegociacao) >= 0);
    },    
    
    acordoLabel: function(sTipoNegociacao){
        switch (sTipoNegociacao) {
            case 'O':
            case 'I':
            case 'F':            
            case 'C':
                return 'Acordo';
            case 'P':
                return 'Negociação';

            default:
                return '';
        }
    },  
    
    comentarioText: function(sTipoNegociacao){
        switch (sTipoNegociacao) {
            case 'O':
            case 'I':
            case 'F':            
            case 'C':
                return 'Ingresse algum comentario para ser adicionado no PDF';            
            case 'P':
                return 'Ingresse algum comentário para a negociação';

            default:
                return '';
        }
    },        

}



