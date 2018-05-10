function AddItemProcessTabelaPrecos(oController){

    this.oController = oController;

    this.toogleAddItemPopover = oEvent => {
        if (!oEvent)
            return;
        if (!this.popover) {
            this.popover = sap.ui.xmlfragment(
                "addItemPopover",
                "simplifique.telaneg.view.AddItemNegociacaoPopover",
                this);
            this.oController.getView().addDependent(this.popover);
        }
        if (this.popover.isOpen())
            this.popover.close()
        else
            this.popover.openBy(oEvent.getSource());
        };

    this.onFornecedorSearch = () => {
        };

    onFornecedorSelected = (oEvent) => {
        let oCtx = oEvent.getSource().getBindingContext('listas');
        let oNavCon = sap.ui.core.Fragment.byId("addItemPopover", "navCon");
        let oDetailPage = sap.ui.core.Fragment.byId("addItemPopover", "gruposListasFornecedor");
        oDetailPage.bindElement({ path: oCtx.getPath(), model: 'listas'});
        oNavCon.to(oDetailPage);
        };

    onGrupoListaSelected = (oEvent) => {
        let oCtx = oEvent.getSource().getBindingContext('listas');
        let oNavCon = sap.ui.core.Fragment.byId("addItemPopover", "navCon");
        let oDetailPage = sap.ui.core.Fragment.byId("addItemPopover", "produtos");
        oDetailPage.bindElement({ path: oCtx.getPath(), model: 'listas'});
        oNavCon.to(oDetailPage);
        };

    onAddGruposListas = (oEvent) => {
        let v = this.oController.getView();
        let sNegociacaoPath = v.getBindingContext().getPath();
        let oNegociacao = v.getBindingContext().getObject();

        let m = v.getModel();

        let oPageGruposListasFornecedor = sap.ui.core.Fragment.byId("addItemPopover", "gruposListasFornecedor");
        let oContextFornecedor = oPageGruposListasFornecedor.getBindingContext('listas')
        let oFornecedor = oContextFornecedor.getObject();

        let oListGruposListas = sap.ui.core.Fragment.byId("addItemPopover", "listGruposListasFornecedor");

        // @todo Codigo sync, deveria ser adaptado para ser async.
        oListGruposListas.getSelectedContexts().forEach( oContextGrupoLista => {

            let oGrupoLista = oContextGrupoLista.getObject();
            oGrupoLista.produtos.forEach( produto => {

                let oContextItem = m.createEntry(
                    //sNegociacaoPath+"/ItemNegociacaoSet", { });
                    "/ItemNegociacaoSet", { properties: {
                        "NegociacaoID": oNegociacao.ID,
                        } });
                });
            });
        m.submitChanges();
        v.byId('itemsTable').getBinding('items').refresh();
        this.popover.close();
    };

    onCancelAddGruposListas = (oEvent) => {
        this.popover.close();
        };

    onNavBack = () => {
        let oNavCon = sap.ui.core.Fragment.byId("addItemPopover", "navCon");
        oNavCon.back();
        };

}

sap.ui.define([
        "sap/ui/base/Object",
        
    ], function (UI5Object) {

    "use strict";

    return UI5Object.extend("simplifique.telaneg.controller.AddItemManager", {


        constructor : function (oController) {
            this.addItemProcessTabelaPrecos = new AddItemProcessTabelaPrecos(oController);
        },

        selectAddItemProcess: function(sTipoNegociacaoID) {

            let TipoNegociacao = {
                TABELA_PRECOS: 'A',
                COMMODITIES: 'B',
                SPOT: 'C',
                };

            switch (sTipoNegociacaoID) {
                case TipoNegociacao.TABELA_PRECOS:
                    return this.addItemProcessTabelaPrecos;
                default:
                    return this.addItemProcessTabelaPrecos;
            }
        },

    });

});

