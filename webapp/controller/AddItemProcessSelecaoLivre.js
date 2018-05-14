
import AddItemProcessBase from "simplifique/telaneg/controller/AddItemProcessBase";

export default class AddItemProcessSelecaoLivre extends AddItemProcessBase{

    constructor(oController){
         super(oController,
            "addItemSelecaoLibrePopover",
            "simplifique.telaneg.view.AddItemNegociacao.SelecaoLibrePopover",
            "listSelecaoItens",
            "navCon");

        this.fornecedoresSelecionados = [];
    }

    onItemPressed(oEvent){
        let oCtx = oEvent.getParameter("listItem").getBindingContext('itens'); // @todo Criar modelo itens
        let viewModel = this.oController.getView().getModel('view'); // @todo Criar modelo view
        let viewData = viewModel.getData();
        let oFornecedor = oCtx.getObject();
        this.fornecedoresSelecionados.push(oFornecedor);
        viewData.sFornecedoresSelecionados = this.fornecedoresSelecionados.length ; // @todo join de fornecedores selecionados.
        viewModel.refresh();
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
