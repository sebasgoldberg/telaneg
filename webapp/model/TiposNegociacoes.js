import ManagedObject from "sap/ui/base/ManagedObject";
import formatter from "simplifique/telaneg/base/model/formatter";

let aIDsControlesAdaptaveis = [
    "UMVColumn",
    "precoVendaColumn",
    "PMZColumn",
    "margemPDVColumn",
    "recomposicaoColumn",
    "margem2SimuladaColumn",
    "menorPrecoMercadoColumn",
    "indiceCompetitividadeColumn",
    "UMBColumn",
    "custoBrutoColumn",
    "custoBrutoEditavelColumn",
    "descontoColumn",
    "despesasAcessoriasColumn",
    "custoLiquidoColumn",
    "recomposicaoColumn",
    "consultasColumn",
    "valorBonificacaoColumn",
    "quantidadeLimiteColumn",
    "totalRecomposicaoColumn",
    "quanVendasPendentesColumn",
    "fornecedoresAdicionaisTable",
    "fornecedoresAdicionaisSubSection",
    "tipoItemMercFormElement",
    "periodoApuracaoRangeSelection",
    "dataDeApuracaoDatePicker",
    "valorLimiteInput",
    "periodoApuracaoLabel",
    "clausulaLabel",
    "clausulaInput",
    "clausulaDescricaoInput",
    "anexosNegociacaoButton",
    "anexosEstipulacaoButton",
    "minutaButton",
    "infoGeralSubSection",
    "infoGeralPrazPagSubSection",
    "abrangenciaObjectPageSection",
    "prazoPagtoObjectPageSection",
    "contratoObjectPageSection",
    "itemsObjectPageSection",
    "statusBox",
    "bonificacaoBox",
    "ComentarioAcordoObjectPageSubSection",
    "canalFormElement"
    ];

let aIDsControlesTaskList = [
    'anexosEstipulacaoColumn',
    'anexosColumn',
    'estipulacaoColumn',
    "idStatusFilter",  
    "idMaterialFilter",  
];

class TipoNegociacao{

    constructor(aIDsControlesVisiveis, aIDsControlesVisiveisTaskList = []){
        this.aIDsControlesVisiveis = aIDsControlesVisiveis;
        this.aIDsControlesVisiveisTaskList = aIDsControlesVisiveisTaskList;
        this.oView = undefined;
    }

    setView(oView){
        this.oView = oView;
    }

    modificarVisibilidade(aTudosOsControles, aControlesVisiveis){
        aTudosOsControles
        .forEach( sIDControle => 
            this.oView.byId(sIDControle).setVisible(
                aControlesVisiveis.indexOf(sIDControle) >= 0)
            );
    }

    adaptarView(){
        this.modificarVisibilidade(aIDsControlesAdaptaveis, this.aIDsControlesVisiveis);
        this.getView().byId("itemsObjectPageSection").setTitle(this.getItemsSectionTitle());
        this.getView().byId("itemsObjectPageSubSection").setTitle(this.getItemsSectionTitle());
    }

    adaptarTaskListView(){
        this.modificarVisibilidade(aIDsControlesTaskList, this.aIDsControlesVisiveisTaskList);
    }

    getView(){
        return this.oView;
    }

    enviarEmailAoFinalizar(){
        return false;
    }

}

/**
 * O tipo de negociação que não faz nada. Serve para toda app UI5 que extende a 
 * app de negociação base.
 */
class TipoNegociacaoVazia extends TipoNegociacao{

    adaptarView(){
    }

    adaptarTaskListView(){
    }

}

class TipoNegociacaoSellOut extends TipoNegociacao{

    constructor(){
        super([
            "UMVColumn",
            "precoVendaColumn",
            "PMZColumn",
            "margemPDVColumn",
            "recomposicaoColumn",
            "margem2SimuladaColumn",
            "menorPrecoMercadoColumn",
            "indiceCompetitividadeColumn",
            "consultasColumn",
            "periodoApuracaoRangeSelection",
            "periodoApuracaoLabel",
            "clausulaLabel",
            "clausulaInput",
            "clausulaDescricaoInput",
            "anexosEstipulacaoButton", 
            "infoGeralSubSection",    
            "abrangenciaObjectPageSection",  
            "contratoObjectPageSection",
            "itemsObjectPageSection",
            "statusBox",
            "bonificacaoBox", 
            "minutaButton",
            "ComentarioAcordoObjectPageSubSection",
            ],[
            'anexosEstipulacaoColumn',
            'estipulacaoColumn',
            "idStatusFilter",  
            "idMaterialFilter",        
            ]);
    }

    getItemsSectionTitle(){
        return "Mercadorias";
    }

    enviarEmailAoFinalizar(){
        return true;
    }

}

class TipoNegociacaoAlocacaoValor extends TipoNegociacao{

    constructor(){
        super([
            "UMVColumn",
            "precoVendaColumn",
            "PMZColumn",
            "margemPDVColumn",
            "recomposicaoColumn",
            "menorPrecoMercadoColumn",
            "indiceCompetitividadeColumn",
            "consultasColumn",
            "quantidadeLimiteColumn",
            "totalRecomposicaoColumn",
            "quanVendasPendentesColumn",
            "dataDeApuracaoDatePicker",
            "valorLimiteInput",
            "periodoApuracaoLabel",
            "clausulaLabel",
            "clausulaInput",
            "clausulaDescricaoInput",
            "anexosEstipulacaoButton", 
            "infoGeralSubSection",    
            "abrangenciaObjectPageSection",  
            "contratoObjectPageSection",
            "itemsObjectPageSection",
            "statusBox",
            "bonificacaoBox", 
            "minutaButton",
            "ComentarioAcordoObjectPageSubSection",
            ],[
            'anexosEstipulacaoColumn',
            'estipulacaoColumn',
            "idStatusFilter",  
            "idMaterialFilter",        
            ]);
    }

    getItemsSectionTitle(){
        return "Mercadorias";
    }

    enviarEmailAoFinalizar(){
        return true;
    }

}


class TipoNegociacaoSellIn extends TipoNegociacao{

    constructor(){
        super([
            "UMBColumn",
            "custoBrutoColumn",
            "custoLiquidoColumn",
            "recomposicaoColumn",
            "fornecedoresAdicionaisTable",
            "fornecedoresAdicionaisSubSection",
            "consultasColumn",
            "periodoApuracaoRangeSelection",
            "periodoApuracaoLabel",
            "clausulaLabel",
            "clausulaInput",
            "clausulaDescricaoInput",
            "anexosEstipulacaoButton", 
            "infoGeralSubSection",    
            "abrangenciaObjectPageSection", 
            "contratoObjectPageSection",
            "itemsObjectPageSection",
            "statusBox",
            "bonificacaoBox",    
            "minutaButton",
            "ComentarioAcordoObjectPageSubSection",
            ],[
            'anexosEstipulacaoColumn',
            'estipulacaoColumn',
            "idStatusFilter",
            "idMaterialFilter",
            ]);
    }

    getItemsSectionTitle(){
        return "Mercadorias";
    }

    enviarEmailAoFinalizar(){
        return true;
    }

}


class TipoNegociacaoValorFixo extends TipoNegociacao{

    constructor(){
        super([
            "tipoItemMercFormElement",
            "valorBonificacaoColumn",
            "clausulaLabel",
            "clausulaInput",
            "clausulaDescricaoInput",
            "anexosEstipulacaoButton",
            "minutaButton",
            "infoGeralSubSection",  
            "abrangenciaObjectPageSection", 
            "contratoObjectPageSection",
            "itemsObjectPageSection",
            "statusBox",
            "bonificacaoBox",          
            "ComentarioAcordoObjectPageSubSection",
            "canalFormElement",
            ],[
            'anexosEstipulacaoColumn',
            'estipulacaoColumn',
            "idStatusFilter",
            "idMaterialFilter",
            ]);
    }

    getItemsSectionTitle(){
        return "Bonificação";
    }

    enviarEmailAoFinalizar(){
        return true;
    }

}

class TipoNegociacaoFarmacia extends TipoNegociacaoValorFixo{

}

class TipoNegociacaoPrazoPagto extends TipoNegociacao{

    constructor(){
        super([
            "anexosNegociacaoButton",
            "infoGeralPrazPagSubSection",
            "prazoPagtoObjectPageSection",
            "ComentarioAcordoObjectPageSubSection",
            "statusBox",
            ],[
            'anexosColumn',
        ]);
    }

    getItemsSectionTitle(){
        return "Prazo de Pagamento";
    }

}

class TipoNegociacaoCustoPontual extends TipoNegociacao{

    constructor(){
        super([
            "UMBColumn",
            "custoBrutoEditavelColumn",
            "descontoColumn",
            "despesasAcessoriasColumn",
            "PMZColumn",
            "precoVendaColumn",
            "margemPDVColumn",
            "margem2SimuladaColumn",
            "menorPrecoMercadoColumn",
            "indiceCompetitividadeColumn",
            "consultasColumn",
            "periodoApuracaoRangeSelection",
            "periodoApuracaoLabel",
            "anexosNegociacaoButton",
            "infoGeralSubSection",
            "abrangenciaObjectPageSection",
            "contratoObjectPageSection",
            "itemsObjectPageSection",
            "statusBox",
            "bonificacaoBox", 
        ],[
            "idStatusFilter",
            "idMaterialFilter",
            ]);
    }

    getItemsSectionTitle(){
        return "Mercadorias";
    }

    adaptarTaskListView(){
    }

}

export default ManagedObject.extend("simplifique.telaneg.base.model.TiposNegociacoes",{

    formatter: formatter,

    constructor : function (oView) {
        this.oView = oView;
        this.oTiposNegociacao = {
            O: new TipoNegociacaoSellOut(),
            V: new TipoNegociacaoAlocacaoValor(),
            I: new TipoNegociacaoSellIn(),
            F: new TipoNegociacaoValorFixo(),
            G: new TipoNegociacaoFarmacia(),
            };
        this.oTipoNegociacaoVazia = new TipoNegociacaoVazia();
    },

    getTipoNegociacao: function(sTipoNegociacao){
        let oTipoNegociacao = this.oTiposNegociacao[sTipoNegociacao];
        if (!oTipoNegociacao)
            return this.oTipoNegociacaoVazia;
        oTipoNegociacao.setView(this.oView);
        return oTipoNegociacao;
    },

});


