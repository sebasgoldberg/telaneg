import Controller from 'simplifique/telaneg/controller/BaseController';
import formatter from 'simplifique/telaneg/model/formatter';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';
import JSONModel from "sap/ui/model/json/JSONModel";
import MessagePopover from 'sap/m/MessagePopover';


export default Controller.extend("simplifique.telaneg.controller.TaskDetail", {

    formatter: formatter,

    onInit: function(){

        Controller.prototype.onInit.call(this);

        this.oMP = new sap.m.MessagePopover({
            items: {
                path:"message>/",
                template: new sap.m.MessagePopoverItem({ description: "{message>description}", type: "{message>type}", title: "{message>message}"})
            }
        });

        this.getView().setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"message");

        let v = this.getView();
        v.setModel(new JSONModel({ }), 'view');

        this.getRouter().getTarget("TaskDetail")
            .attachDisplay( oEvent => {

                this.sNegociacaoID = oEvent.mParameters.data.negociacaoID;
                let oPath = {
                    path: `/NegociacaoSet('${this.sNegociacaoID}')/`,
                    parameters: {
                        expand: 'tipoNegociacao,fornecedor,status,bandeira,clausula,abrangencia'
                        },
                };

                this.getView().bindObject(oPath);

            });
    },

    suggestClausula: async function(oEvent) {
        var sTerm = oEvent.getParameter("suggestValue");
        var aFilters = [];
        if (sTerm) {
            aFilters.push(new Filter("Descricao", FilterOperator.Contains, sTerm));
            if (sTerm.length < 4)
                aFilters.push(new Filter("ID", FilterOperator.StartsWith, sTerm))
            else if (sTerm.length == 4)
                aFilters.push(new Filter("ID", FilterOperator.EQ, sTerm));
        }
        oEvent.getSource().getBinding("suggestionItems").filter(aFilters);

    },

    onValueHelpLojas: async function(oEvent) {
        let selecaoLojaDialog = this.getOwnerComponent().getSelecaoLojaDialog();
        try {
            let v = this.getView();
            let oListLoja = await selecaoLojaDialog.open(v.getBindingContext().getPath());
            let sPath = `${v.getBindingContext().getPath()}/lojas`;
            let m = this.getView().getModel();
            let oPromisesEntries = oListLoja.getSelectedItems().map( oItem => oItem.getBindingContext().getObject() )
                .map( oLoja => 
                    this.createEntry(sPath,{
                        ID: oLoja.ID,
                        }, false)
                );
            if (oPromisesEntries.length > 0){
                oPromisesEntries.push(this.submitChanges())
                try {
                    let results = await this.all(oPromisesEntries);
                    m.refresh();
                } catch (e) {
                    console.error(e);
                    this.resetChanges();
                }
            }
        } catch (e) {
        }
    },

    onUpdateLojas: async function(oEvent) {
        let oParams = oEvent.getParameters();
        let oSource = oEvent.getSource();
        let oContext = oEvent.getSource().getBindingContext();
        let oTokensBinding = oEvent.getSource().getBinding('tokens');
        let aRemovePromises = oParams.removedTokens.map( oToken => oToken.getBindingContext().getPath() )
            //.map( bc => bc.getObject() )
            //.map( oObject => `${oContext.getPath()}/${oTokensBinding.getPath()}` )
            .map( sPath => this.remove(sPath, { NegociacaoID: oContext.getObject().ID }) );
        try {
            let result = await this.all(aRemovePromises);
            this.getModel().refresh();
        } catch (e) {
            this.error(e);
        }
    },

    handleMessagePopoverPress: function (oEvent) {
        this.oMP.toggle(oEvent.getSource());
    },

    onAdicionarMercadoria: async function(oEvent) {
        let selectedContexts;

        let selecaoMercadoriaFornecedor = this.getOwnerComponent().getSelecaoMercadoriaFornecedorDialog();
        let v = this.getView();

        try {
            selectedContexts = await selecaoMercadoriaFornecedor.open(v.getBindingContext().getPath());
        } catch (e) {
            return;
        }

        let oNegociacao = v.getBindingContext().getObject();
        let sPath = `${v.getBindingContext().getPath()}/materiais`;
        let m = v.getModel();
        let oPromisesEntries = selectedContexts.map( oContext => oContext.getObject() )
            .map( oMaterial => 
                this.createEntry(sPath,{
                    ID: oMaterial.ID,
                    Type: oMaterial.Type,
                    }, false)
            );
        if (oPromisesEntries.length == 0)
            return;
        oPromisesEntries.push(this.submitChanges())
        try {
            let results = await this.all(oPromisesEntries);
            m.refresh();
        } catch (e) {
            this.resetChanges();
            console.error(e);
        }

    },

    onEliminarItensSelecionados: function(oEvent) {
        this.deleteSelectedItems('itemsTable');
    },

    onMostrarImpostos: function(oEvent) {
        let sItemPath = oEvent.getSource().getBindingContext().getPath();
        let oImpostosPopOver = this.getOwnerComponent().getImpostosPopover();
        oImpostosPopOver.open(`${sItemPath}/subitem`, oEvent.getSource());
    },

});

