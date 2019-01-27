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
        m.setProperty('/isNegociacaoEmAnalises',this.isNegociacaoEmAnalises());
        m.setProperty('/isNegociacaoEmAprovacao',this.isNegociacaoEmAprovacao());
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

    isNegociacaoEmAnalises(){
        return false;
    }

    isNegociacaoEmAprovacao(){
        return false;
    }

}

class TipoEmAnalises extends TipoStatus{
    isNegociacaoEmAnalises(){
        return true;
    }
}

class TipoEmAprovacao extends TipoStatus{
    isNegociacaoEmAprovacao(){
        return true;
    }
}

class TipoEmNegociacao extends TipoStatus{

    isNegociacaoEditavel(){
        return true;
    }

}

class TipoNovaCotacao extends TipoStatus{

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
        this.tipoEmAnalises = new TipoEmAnalises();
        this.tipoEmAprovacao = new TipoEmAprovacao();
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
            case 'V':
                oTipoStatus = this.tipoNovaCotacao;
                break;
            case 'N':
                oTipoStatus = this.tipoEmAnalises;
                break;
            case 'P':
                oTipoStatus = this.tipoEmAprovacao;
                break;
            default:
                oTipoStatus = this.tipoAposNegociacao;
                break;
        }
        oTipoStatus.setView(this.oView);
        return oTipoStatus;
    },

});



