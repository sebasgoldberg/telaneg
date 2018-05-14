import AddItemProcessBase from "simplifique/telaneg/controller/AddItemProcessBase";

export default class AddItemProcessTabelaPrecos extends AddItemProcessBase{

    constructor(oController){
        super(oController,
            "addItemPopover",
            "simplifique.telaneg.view.AddItemNegociacaoPopover",
            "listGruposListas",
            "navCon");
    }

    onGrupoListaSelected(oEvent){
        let oCtx = oEvent.getParameter("listItem").getBindingContext('listas');
        let oNavCon = sap.ui.core.Fragment.byId(this.fragmentId, this.navContainerId);
        let oDetailPage = sap.ui.core.Fragment.byId(this.fragmentId, "produtos");
        oDetailPage.bindElement({ path: oCtx.getPath(), model: 'listas'});
        oNavCon.to(oDetailPage);
    }

    addItemsForContext(oContext){

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


}

