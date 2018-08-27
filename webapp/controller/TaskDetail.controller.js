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
        v.setModel(new JSONModel({
            AtualizacaoEliminacoes: false,
            }), 'view');

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

    onValueHelpItemOrg: async function(oEvent) {
        let selecaoItemOrgDialog = this.getOwnerComponent().getSelecaoItemOrgDialog();
        try {
            let v = this.getView();
            let oListItemsOrg = await selecaoItemOrgDialog.open(v.getBindingContext().getPath());
            let sPath = `${v.getBindingContext().getPath()}/itemsOrg`;
            let m = this.getView().getModel();
            let oPromisesEntries = oListItemsOrg.getSelectedItems().map( oItem => oItem.getBindingContext().getObject() )
                .map( oItemOrg => 
                    this.createEntry(sPath,{
                        ID: oItemOrg.ID,
                        Type: this.getView().getBindingContext().getProperty('TipoAbrangencia'),
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
            console.error(e);
        }
    },

    onUpdateItemOrg: async function(oEvent) {
        let oParams = oEvent.getParameters();
        let oSource = oEvent.getSource();
        let oContext = oEvent.getSource().getBindingContext();
        let aRemovePromises = oParams.removedTokens.map( oToken => oToken.getBindingContext().getPath() )
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
        let oTree = this.getView().byId('treeTable');
        let aContexts = oTree.getSelectedIndices()
            .map( index => oTree.getContextByIndex(index));
        this.deleteContexts(aContexts);
    },

    onMostrarImpostos: function(oEvent) {
        let sItemPath = oEvent.getSource().getBindingContext().getPath();
        let oImpostosPopOver = this.getOwnerComponent().getImpostosPopover();
        oImpostosPopOver.open(`${sItemPath}`, oEvent.getSource());
    },

});

