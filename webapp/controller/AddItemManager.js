function AddItemProcessBase(oController, fragmentId, fragmentPath, listWithSelectionsId){

    this.oController = oController;
    this.fragmentId = fragmentId;
    this.fragmentPath = fragmentPath;
    this.listWithSelectionsId = listWithSelectionsId;

    this.toogleAddItemPopover = oEvent => {
        if (!oEvent)
            return;
        if (!this.popover) {
            this.popover = sap.ui.xmlfragment(
                this.fragmentId,
                this.fragmentPath,
                this);
            this.oController.getView().addDependent(this.popover);
        }
        if (this.popover.isOpen())
            this.popover.close()
        else
            this.popover.openBy(oEvent.getSource());
        };

    this.addItems = (oSelectedContexts) => {

        let v = this.oController.getView();
        let m = v.getModel();

        // @todo Codigo sync, deveria ser adaptado para ser async.
        oSelectedContexts.forEach( oContextGrupoLista => {

            this.addItemsForContext(oContextGrupoLista);

            });

        m.submitChanges();
        v.byId('itemsTable').getBinding('items').refresh();
        this.popover.close();
        };

    this.onCancel = (oEvent) => {
        this.popover.close();
        };

    this.onNavBack = () => {
        let oNavCon = sap.ui.core.Fragment.byId(this.fragmentId, "navCon");
        oNavCon.back();
        };

    this.onAdd = (oEvent) => {
        let oListGruposListas = sap.ui.core.Fragment.byId(this.fragmentId, this.listWithSelectionsId);
        oSelectedContexts = oListGruposListas.getSelectedContexts();
        this.addItems(oSelectedContexts);
        };

}


function AddItemProcessTabelaPrecos(oController){

    AddItemProcessBase.call(this, oController,
        "addItemPopover",
        "simplifique.telaneg.view.AddItemNegociacaoPopover",
        "listGruposListas");
}

AddItemProcessTabelaPrecos.prototype = Object.create(AddItemProcessBase.prototype);
AddItemProcessTabelaPrecos.prototype.constructor = AddItemProcessTabelaPrecos;

AddItemProcessTabelaPrecos.prototype.onGrupoListaSelected = function(oEvent){
    let oCtx = oEvent.getParameter("listItem").getBindingContext('listas');
    let oNavCon = sap.ui.core.Fragment.byId(this.fragmentId, "navCon");
    let oDetailPage = sap.ui.core.Fragment.byId(this.fragmentId, "produtos");
    oDetailPage.bindElement({ path: oCtx.getPath(), model: 'listas'});
    oNavCon.to(oDetailPage);
}

AddItemProcessTabelaPrecos.prototype.addItemsForContext = function(oContext){

    let v = this.oController.getView();
    let oNegociacao = v.getBindingContext().getObject();
    let m = v.getModel();

    let oGrupoLista = oContext.getObject();
    oGrupoLista.produtos.forEach( produto => {

        let oContextItem = m.createEntry(
            "/ItemNegociacaoSet", { properties: {
                "NegociacaoID": oNegociacao.ID,
                } });
        });

};


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

