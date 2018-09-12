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
    }

    getView(){
        return this.oView;
    }
}

class TipoEmNegociacao extends TipoStatus{

    isNegociacaoEditavel(){
        return true;
    }

}


class TipoAposNegociacao extends TipoStatus{

    isNegociacaoEditavel(){
        return false;
    }

}

export default ManagedObject.extend("simplifique.telaneg.model.TiposStatus",{

    constructor : function (oView) {
        this.oView = oView;
        this.tipoEmNegociacao = new TipoEmNegociacao();
        this.tipoAposNegociacao = new TipoAposNegociacao();
    },

    getTipoStatus: function(oNegociacao){
        let oTipoStatus;
        switch (oNegociacao.Status.replace(/ /g,'')) {
            case '':
                oTipoStatus = this.tipoEmNegociacao;
                break;
            default:
                oTipoStatus = this.tipoAposNegociacao;
                break;
        }
        oTipoStatus.setView(this.oView);
        return oTipoStatus;
    },

});



