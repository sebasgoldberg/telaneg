import Controller from 'simplifique/telaneg/controller/BaseController';
import formatter from 'simplifique/telaneg/model/formatter';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';
import JSONModel from "sap/ui/model/json/JSONModel";
import MessagePopover from 'sap/m/MessagePopover';


export default Controller.extend("simplifique.telaneg.controller.TaskDetail", {

    formatter: formatter,

    aAtributosComGravadoAutomatico: [
        "FornecedorID",
        "ClausulaID",
        "Bandeira",
        "TipoAbrangencia",
        ],

    onInit: function(){

        Controller.prototype.onInit.call(this);

        this.getView().setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"message");

        let v = this.getView();
        v.setModel(new JSONModel({
            AtualizacaoEliminacoes: false,
            }), 'view');


        this.getOwnerComponent().getModel().attachPropertyChange(oEvent => {
            let oParams = oEvent.getParameters();
            if (this.aAtributosComGravadoAutomatico.indexOf(oParams.path) < 0)
                return;
            this.save();
            });

        this.getRouter().getTarget("TaskDetail")
            .attachDisplay( oEvent => {

                if (this.sNegociacaoID && this.sNegociacaoID == oEvent.mParameters.data.negociacaoID)
                    return;

                let m = this.getModel();
                if (m.hasPendingChanges())
                    m.resetChanges();

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
                    this.refreshItems();
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
        if (oParams.type != "removed")
            return;

        let oContext = oSource.getBindingContext();
        let aRemovePromises = oParams.removedTokens.map( oToken => oToken.getBindingContext().getPath() )
            .map( sPath => this.remove(sPath, { NegociacaoID: oContext.getObject().ID }) );
        try {
            let result = await this.all(aRemovePromises);
            this.refreshItems();
        } catch (e) {
            this.error(e);
            //this.getModel().resetChanges()
            oSource.getBinding('tokens').refresh(true);
        }
    },

    handleMessagePopoverPress: function (oEvent) {
        if (!this.oMP){
            this.oMP = new sap.m.MessagePopover({
                items: {
                    path:"message>/",
                    template: new sap.m.MessageItem({ description: "{message>description}", type: "{message>type}", title: "{message>message}"})
                }
            });
            this.oMP.setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"message");
        }
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
            this.setBusy();
            let results = await this.all(oPromisesEntries);
            this.refreshItems();
        } catch (e) {
            this.resetChanges();
            console.error(e);
        } finally {
            this.setFree();
        }

    },

    refreshItems: function() {
        this.getView().byId('treeTable').getBinding('rows').refresh();
    },

    onEliminarItensSelecionados: async function(oEvent) {
        let oTree = this.getView().byId('treeTable');
        let aContexts = oTree.getSelectedIndices()
            .map( index => oTree.getContextByIndex(index));
        if (await this.deleteContexts(aContexts))
            this.refreshItems();
    },

    onMostrarImpostos: function(oEvent) {
        let sItemPath = oEvent.getSource().getBindingContext().getPath();
        let oImpostosPopOver = this.getOwnerComponent().getImpostosPopover();
        oImpostosPopOver.open(`${sItemPath}`, oEvent.getSource());
    },

    onMostrarVendas: function(oEvent) {
        let sItemPath = oEvent.getSource().getBindingContext().getPath();
        let oVendasPopOver = this.getOwnerComponent().getVendasPopover();
        oVendasPopOver.open(`${sItemPath}`, oEvent.getSource());
    },

    onMostrarEstoque: function(oEvent) {
        let sItemPath = oEvent.getSource().getBindingContext().getPath();
        let oStockPopOver = this.getOwnerComponent().getStockPopover();
        oStockPopOver.open(`${sItemPath}`, oEvent.getSource());
    },

    onPostComentario: async function(oEvent) {
        let v = this.getView();
        let m = this.getModel();
        let oComentariosItemsBinding = v.byId('comentariosList').getBinding('items');
        let sPathComentarios = `${v.getBindingContext().getPath()}/${oComentariosItemsBinding.getPath()}`;
        let oComentariosFeedInput = v.byId('comentarioFeedInput');
        try {
            oComentariosFeedInput.setBusy(true);
            let result = await this.createEntry(sPathComentarios,{
                Texto: oEvent.getParameters().value,
                })
            oComentariosItemsBinding.refresh();
        } catch (e) {
            console.error(e);
        } finally{
            oComentariosFeedInput.setBusy(false);
        }
    },

    onDeleteComentario: async function(oEvent){
        let v = this.getView();
        let oParams = oEvent.getParameters();
        let oListItem = oParams.listItem;
        let oNegociacao = v.getBindingContext().getObject();
        try {
            oListItem.setBusy(true);
            await this.remove(oListItem.getBindingContextPath(), {NegociacaoID: oNegociacao.ID});
            oComentariosItemsBinding.refresh();
        } catch (e) {
            this.error(e);
        } finally {
            oListItem.setBusy(false);
        }
    }

});

