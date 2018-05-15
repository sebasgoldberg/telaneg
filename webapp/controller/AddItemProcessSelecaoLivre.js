import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import AddItemProcessBase from "simplifique/telaneg/controller/AddItemProcessBase";

export default class AddItemProcessSelecaoLivre extends AddItemProcessBase{

    constructor(oController){
        super(oController,
            "addItemSelecaoLibrePopover",
            "simplifique.telaneg.view.AddItemNegociacao.SelecaoLibrePopover",
            "listSelecaoItens",
            "navCon2");

        this.itens = {
            itens: []
            };

        this.view = {
            fornecedoresSelecionados: 0,
            };

        let oModel = new JSONModel(this.itens);
        this.getView().setModel(oModel,'itens');
        oModel.refresh();

        oModel = new JSONModel(this.view);
        this.getView().setModel(oModel,'view');
        oModel.refresh();

    }

	onSelectionChange(oEvt) {
		var oList = oEvt.getSource();
		var aContexts = oList.getSelectedContexts(true);
        let viewModel = this.oController.getView().getModel('view');
		this.view.fornecedoresSelecionados = aContexts.length;
        viewModel.setData(this.view);
        viewModel.refresh();
	}

    onSearch(oEvt) {

        // add filter for search
        var aFilters = [];
        var sQuery = oEvt.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
            var filter = new Filter("ID", sap.ui.model.FilterOperator.Contains, sQuery);
            aFilters.push(filter);
        }

        // update list binding
        var list = sap.ui.core.Fragment.byId(this.fragmentId, "listFornecedores");
        var binding = list.getBinding("items");
        binding.filter(aFilters, sap.ui.model.FilterType.Application);
    }

    atualizarFornecedoresSelecionados(oEvent){
        
        }

    addItemsForContext(oContext){

        let v = this.oController.getView();
        let oNegociacao = v.getBindingContext().getObject();
        let m = v.getModel();

        let oItem = oContext.getObject();

        let oContextItem = m.createEntry(
            "/ItemNegociacaoSet", { properties: oItem });

    }

}
