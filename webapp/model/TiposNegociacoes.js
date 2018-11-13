import ManagedObject from "sap/ui/base/ManagedObject";
import formatter from "simplifique/telaneg/model/formatter";

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
    "fornecedoresAdicionaisTable",
    "fornecedoresAdicionaisSubSection",
    "tipoItemMercFormElement",
    "periodoApuracaoRangeSelection",
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
    ];

let aIDsControlesTaskList = [
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
            'anexosColumn',
            'estipulacaoColumn',
            "idStatusFilter",  
            "idMaterialFilter",          
            ]);
    }

    getItemsSectionTitle(){
        return "Mercadorias";
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
            'anexosColumn',
            'estipulacaoColumn',
            "idStatusFilter",
            "idMaterialFilter",
            ]);
    }

    getItemsSectionTitle(){
        return "Mercadorias";
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
            ],[
            'anexosColumn',
            'estipulacaoColumn',
            "idStatusFilter",
            "idMaterialFilter",
            ]);
    }

    getItemsSectionTitle(){
        return "Bonificação";
    }

}

class TipoNegociacaoPrazoPagto extends TipoNegociacao{

    constructor(){
        super([
            "anexosNegociacaoButton",
            "infoGeralPrazPagSubSection",
            "prazoPagtoObjectPageSection",
            "ComentarioAcordoObjectPageSubSection"

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

}

export default ManagedObject.extend("simplifique.telaneg.model.TiposNegociacoes",{

    formatter: formatter,

    constructor : function (oView) {
        this.oView = oView;
        this.oTiposNegociacao = {
            O: new TipoNegociacaoSellOut(),
            I: new TipoNegociacaoSellIn(),
            F: new TipoNegociacaoValorFixo(),
            P: new TipoNegociacaoPrazoPagto(),
            C: new TipoNegociacaoCustoPontual(),
            };
    },

    getTipoNegociacao: function(sTipoNegociacao){
        let oTipoNegociacao = this.oTiposNegociacao[sTipoNegociacao];
        oTipoNegociacao.setView(this.oView);
        return oTipoNegociacao;
    },

});


