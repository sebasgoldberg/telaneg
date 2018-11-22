import ManagedObject from "sap/ui/base/ManagedObject";

class TipoStatus{

    constructor(){
        this.oView = undefined;
    }

    setView(oView){
        this.oView = oView;
    }

    adaptarView(){
        let m = this.getView().getModel('view');
        m.setProperty('/isNegociacaoEditavel',this.isNegociacaoEditavel());
        m.setProperty('/isNegociacaoConcluida',this.isNegociacaoConcluida());
    }

    getView(){
        return this.oView;
    }

    isNegociacaoEditavel(){
        return false;
    }

    isNegociacaoConcluida(){
        return false;
    }

}

class TipoEmNegociacao extends TipoStatus{

    isNegociacaoEditavel(){
        return true;
    }

}


class TipoPendenteFormalizar extends TipoStatus{

    isNegociacaoConcluida(){
        return true;
    }

}

class TipoAposNegociacao extends TipoStatus{

}

export default ManagedObject.extend("simplifique.telaneg.base.model.TiposStatus",{

    constructor : function (oView) {
        this.oView = oView;
        this.tipoEmNegociacao = new TipoEmNegociacao();
        this.tipoPendenteFormalizar = new TipoPendenteFormalizar();
        this.tipoAposNegociacao = new TipoAposNegociacao();
    },

    getTipoStatus: function(oNegociacao){
        let oTipoStatus;
        switch (oNegociacao.Status.replace(/ /g,'')) {
            case '':
                oTipoStatus = this.tipoEmNegociacao;
                break;
            case 'Z':
                oTipoStatus = this.tipoPendenteFormalizar;
                break;
            default:
                oTipoStatus = this.tipoAposNegociacao;
                break;
        }
        oTipoStatus.setView(this.oView);
        return oTipoStatus;
    },

});



