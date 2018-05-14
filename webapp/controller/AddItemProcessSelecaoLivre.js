import JSONModel from "sap/ui/model/json/JSONModel"
import AddItemProcessBase from "simplifique/telaneg/controller/AddItemProcessBase";

export default class AddItemProcessSelecaoLivre extends AddItemProcessBase{

    constructor(oController){
        super(oController,
            "addItemSelecaoLibrePopover",
            "simplifique.telaneg.view.AddItemNegociacao.SelecaoLibrePopover",
            "listSelecaoItens",
            "navCon2");

        this.itens = {
            FornecedorSet:[
               {
                   ID: 'ID 01',
                   Nome: 'Nome 01',
                   },
               {
                   ID: 'ID 02',
                   Nome: 'Nome 02',
                   },
               {
                   ID: 'ID 03',
                   Nome: 'Nome 03',
                   },
            ]
            };

        this.view = {
            fornecedoresSelecionados:'', 
            items:[],
            };

        let oModel = new JSONModel(this.itens);
        this.getView().setModel(oModel,'itens');
        oModel.refresh();

        oModel = new JSONModel(this.view);
        this.getView().setModel(oModel,'view');
        oModel.refresh();



        this.fornecedoresSelecionados = [];
    }

    onItemPressed(oEvent){
        let oCtx = oEvent.getParameter("listItem").getBindingContext('itens'); // @todo Criar modelo itens
        let viewModel = this.oController.getView().getModel('view'); // @todo Criar modelo view
        //let viewData = viewModel.getData();
        let oFornecedor = oCtx.getObject();
        this.fornecedoresSelecionados.push(oFornecedor);
        this.view.fornecedoresSelecionados = this.fornecedoresSelecionados.map(f=>f.Nome).join(', ');
        //viewData.sFornecedoresSelecionados = this.fornecedoresSelecionados.length ; // @todo smartlink?
        viewModel.setData(this.view);
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
