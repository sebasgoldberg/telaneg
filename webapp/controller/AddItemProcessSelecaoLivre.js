import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import AddItemProcessBase from "simplifique/telaneg/controller/AddItemProcessBase";

class SelectionPage{

    constructor(oData, oModel, aFilterFields, sListID, sCountPropertyPath, oProcess, sPageID, oNextPage){
        this.oProcess = oProcess;
        this.oData = oData;
        this.oModel = oModel;
        this.aFilterFields = aFilterFields;
        this.sListID = sListID;
        this.sCountPropertyPath = sCountPropertyPath;
        this.sFragmentID = this.oProcess.fragmentId;
        this.sPageID = sPageID;
        if (oNextPage){
            this.sNextPageID = oNextPage.sPageID;
            oNextPage.oPreviousPage = this;
            this.oNextPage = oNextPage;
        }
    }

    onSeguinte(oEvent){
        if (this.sNextPageID === undefined){
            this.oProcess.onAdd(oEvent);
            return this;
        }

        let oNavCon = this.oProcess.getNavCon();
        oNavCon.to(
            sap.ui.core.Fragment.byId(this.sFragmentID, this.sNextPageID));

        return this.oNextPage;
    }

    onPrevious(oEvent){
        return this.oPreviousPage;
        }

	onSelectionChange(oEvt) {
		var oList = oEvt.getSource();
		var aContexts = oList.getSelectedContexts(true);
		this.oData[this.sCountPropertyPath] = aContexts.length;
        this.oModel.setData(this.oData);
        this.oModel.refresh();
	}

    onSearch(oEvt) {

        // add filter for search
        var aFilters = [];
        var sQuery = oEvt.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
        this.aFilterFields
            .map( sField => new Filter(sField, sap.ui.model.FilterOperator.Contains, sQuery) )
            .forEach( filter => aFilters.push(filter) );
        }

        // update list binding
        var list = sap.ui.core.Fragment.byId(this.sFragmentID, this.sListID);
        var binding = list.getBinding("items");
        binding.filter(aFilters, sap.ui.model.FilterType.Application);
    }



    }

export default class AddItemProcessSelecaoLivre extends AddItemProcessBase{

    constructor(oController){
        super(oController,
            "addItemSelecaoLibrePopover",
            "simplifique.telaneg.view.AddItemNegociacao.SelecaoLibrePopover",
            "listItens",
            "navCon2");

        this.itens = {
            itens: []
            };

        this.view = {
            fornecedoresSelecionados: 0,
            materiaisSelecionados: 0,
            centrosSelecionados: 0,
            itensSelecionados: 0,
            sTextoBotaoSeguinte: "Seguinte",
            };

        let oModel = new JSONModel(this.itens);
        this.getView().setModel(oModel,'itens');
        oModel.refresh();

        oModel = new JSONModel(this.view);
        this.getView().setModel(oModel,'view');
        oModel.refresh();

        let oSelecaoItensPage = new SelectionPage(
            this.view, oModel, ['ID'], "listItens", "itensSelecionados",
            this, 'selecaoItens')
        let oSelecaoCentrosPage = new SelectionPage(
            this.view, oModel, ['ID'], "listCentros", "centrosSelecionados",
            this, 'selecaoCentros', oSelecaoItensPage)
        let oSelecaoMateriaisPage = new SelectionPage(
            this.view, oModel, ['ID'], "listMateriais", "materiaisSelecionados",
            this, 'selecaoMateriais', oSelecaoCentrosPage)
        let oSelecaoFornecedoresPage = new SelectionPage(
            this.view, oModel, ['ID'], "listFornecedores", "fornecedoresSelecionados",
            this, 'selecaoFornecedores', oSelecaoMateriaisPage)

        this.currentSelectionPage = oSelecaoFornecedoresPage;
        this.oSelecaoFornecedoresPage = oSelecaoFornecedoresPage;
        this.oSelecaoItensPage = oSelecaoItensPage;
    }

	onSelectionChange(oEvt) {
        this.currentSelectionPage.onSelectionChange(oEvt);
	}

    onSearch(oEvt) {
        this.currentSelectionPage.onSearch(oEvt);
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

    setTextoBotaoSeguinte(sText){
        let oModel = this.oController.getView().getModel('view')
        let oData = oModel.getData();
        oData.sTextoBotaoSeguinte = sText;
        oModel.setData(oData);
        oModel.refresh();
        }

    onSeguinte(oEvent){
        this.currentSelectionPage = this.currentSelectionPage.onSeguinte();
        if (this.currentSelectionPage == this.oSelecaoItensPage)
            this.setTextoBotaoSeguinte('Adicionar');
        }

    onNavBack(oEvent){
        this.currentSelectionPage = this.currentSelectionPage.onPrevious();
        super.onNavBack(oEvent);
        this.setTextoBotaoSeguinte('Seguinte');
        }
}
