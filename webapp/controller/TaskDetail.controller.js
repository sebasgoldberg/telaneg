import Controller from 'simplifique/telaneg/base/controller/BaseController';
import formatter from 'simplifique/telaneg/base/model/formatter';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';
import JSONModel from "sap/ui/model/json/JSONModel";
import MessagePopover from 'sap/m/MessagePopover';
import TiposNegociacoes from 'simplifique/telaneg/base/model/TiposNegociacoes';
import TiposStatus from 'simplifique/telaneg/base/model/TiposStatus';
import MessageToast from 'sap/m/MessageToast';
import FilterType from 'sap/ui/model/FilterType';
import Sorter from "sap/ui/model/Sorter";


export default Controller.extend("simplifique.telaneg.base.controller.TaskDetail", {

    formatter: formatter,

    aAtributosComGravadoAutomatico: [
        "FornecedorID",
        "ClausulaID",
        "Bandeira",
        "TipoAbrangencia",
        "TipoItemMercID",
        ],

    onInit: function(){

        Controller.prototype.onInit.call(this);

        this.tiposNegociacoes = new TiposNegociacoes(this.getView());
        this.tiposStatus = new TiposStatus(this.getView());

        this.getView().setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"message");

        let v = this.getView();

        v.setModel(new JSONModel({
            itemsFilter: {
                fornecedores: [],
                itemsMerc: [],
                itemsOrg: [],
                },
            AtualizacaoEliminacoes: false,
            isNegociacaoEditavel: false,
            isNegociacaoConcluida: false,
            isNegociacaoEmAnalises: false,
            isNegociacaoEmAprovacao: false,
            periodoApuracao:{
                minDate: this.getMinPeriodoApuracao(),
                },
            }), 'view');


        this.getOwnerComponent().getModel().attachPropertyChange(oEvent => {
            let oParams = oEvent.getParameters();
            if (this.aAtributosComGravadoAutomatico.indexOf(oParams.path) < 0)
                return;
            this.save();
            });

        this.getRouter().getTarget("TaskDetail")
            .attachDisplay( async oEvent => {

                if (this.sNegociacaoID && this.sNegociacaoID == oEvent.mParameters.data.negociacaoID)
                    return;


                let m = this.getModel();
                if (m.hasPendingChanges())
                    m.resetChanges();

                this.sNegociacaoID = oEvent.mParameters.data.negociacaoID;

                let sExpand = this.getNegociacaoSetExpandAttr();

                let oPath = {
                    path: `/NegociacaoSet('${this.sNegociacaoID}')/`,
                    parameters: {                        
                        expand: sExpand
                        },
                };

                await this.bindObject(oPath);

                this.adaptarView();

            });
    },

    getMinPeriodoApuracao: function() {
        let oAmanha = new Date();
        oAmanha.setDate(oAmanha.getDate()+1);
        return oAmanha;
    },

    adaptarView: function() {
        let oNegociacao = this.getView().getBindingContext().getObject();

        this.tipoNegociacao = this.tiposNegociacoes.getTipoNegociacao(oNegociacao.TipoNegociacao);
        this.tipoNegociacao.adaptarView();

        this.tipoStatus = this.tiposStatus.getTipoStatus(oNegociacao);
        this.tipoStatus.adaptarView();
    },

    getNegociacaoSetExpandAttr: function() {
        return 'tipoNegociacao,fornecedor,status,bandeira,clausula,abrangencia,comentarioImpressao,comentarioRejeicao,contrato';
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

    onValueHelpClausulaInput: async function(oEvent) {
        let oSource = oEvent.getSource();
        let selecaoItemOrgDialog = this.getOwnerComponent().getSelecaoClausulaDialog();
        try {
            let v = this.getView();
            let selectedContexts = await selecaoItemOrgDialog.open(v.getBindingContext().getPath());
            selectedContexts.slice(0,1).map( c => c.getObject() ).forEach( o => oSource.setValue(o.ID) );
        } catch (e) {
            console.error(e);
        }
   
    },

    onValueHelpItemOrg: async function(oEvent) {
        let sTipoAbrangencia = this.getView().getBindingContext().getProperty('TipoAbrangencia')
        let selecaoItemOrgDialog = this.getOwnerComponent().getSelecaoItemOrgDialog(sTipoAbrangencia);
        try {
            let v = this.getView();
            let selectedContexts = await selecaoItemOrgDialog.open(v.getBindingContext().getPath());
            let sPath = `${v.getBindingContext().getPath()}/itemsOrg`;
            let m = this.getView().getModel();
            let oPromisesEntries = selectedContexts.map( oContext => oContext.getObject() )
                .map( oItemOrg => 
                    this.createEntry(sPath,{
                        ID: oItemOrg.ID,
                        Type: sTipoAbrangencia,
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

    onAdicionarMercadoria: async function(oEvent) {

        // Abrimos o pup up para seleção.
        let v = this.getView();
        let bc = v.getBindingContext();
        let sTipoItemMerc = v.getBindingContext().getProperty('TipoItemMercID');
        let selecaoMercadoriaFornecedor = this.getOwnerComponent().getSelecaoItemMercDialog(sTipoItemMerc);
        let selectedContexts = await selecaoMercadoriaFornecedor.open(
            bc.getPath()
            //[ new Filter('FornecedorID', FilterOperator.EQ, bc.getProperty('FornecedorID')) ]
            );

        if (selectedContexts.length == 0)
            return;

        // Obtemos os atributos dos objetos selecionados.
        let oNegociacao = v.getBindingContext().getObject();
        let sPath = `${v.getBindingContext().getPath()}/itemsMerc`;
        let oObjects = selectedContexts.map( oContext => oContext.getObject() )
            .map( oMaterial => ({
                ID: oMaterial.ID,
                Type: sTipoItemMerc,
                }));

        // Criamos as entradas para os objetos selecionados.
        try {
            this.setBusy();
            let results = await this.createEntries(sPath, oObjects);
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
        } catch (e) {
            this.error(e);
        } finally {
            oListItem.setBusy(false);
        }
    },

    onGetPDF: function(oEvent) {
        let sNegoPath = this.getView().getBindingContext().getPath();
        let oSource = oEvent.getSource();
        try {
            let sUrl = this.getOwnerComponent().getUrlContent(`${sNegoPath}/pdf`);
            this.openUrl(sUrl);
        } catch (e) {
            this.error(e);
        }
    },

    onMostrarAnexos: function(oEvent) {
        let sNegociacaoPath = this.getView().getBindingContext().getPath();
        let oAnexosNegociacaoDialog = this.getOwnerComponent().getAnexosNegociacaoDialog();
        oAnexosNegociacaoDialog.open(sNegociacaoPath);
    },

    onMostrarAnexosEstipulacao: function(oEvent) {
        let sNegociacaoPath = this.getView().getBindingContext().getPath();
        let oAnexosEstipulacaoDialog = this.getOwnerComponent().getAnexosEstipulacaoDialog();
        oAnexosEstipulacaoDialog.open(sNegociacaoPath);
    },


    onReset: function(oEvent) {
        this.reset();
    },

    onAddFornecedorAdicional: async function(oEvent) {

        // Abrimos o pup up para seleção.
        let v = this.getView();
        let selecaoFornecedor = this.getOwnerComponent().getSelecaoFornecedorDialog();
        let selectedContexts = await selecaoFornecedor.open(v.getBindingContext().getPath());

        if (! selectedContexts)
            return Promise.resolve(false);

        let oTable = v.byId('fornecedoresAdicionaisTable');

        let oObjects = selectedContexts.map( oContext => oContext.getObject() )
            .map( oObject => ({ ID: oObject.ID, Type: oObject.Type, }) );

        return this.createEntriesForTable(oTable, oObjects);

    },

    onDeleteFornecedorAdicional: function(oEvent) {
        return this.deleteSelectedItems('fornecedoresAdicionaisTable', {
            NegociacaoID: this.getView().getBindingContext().getProperty('ID'),
            });
    },

    temCerteza: function({
            pergunta = "Tem certeza que deseja concluir a negociação?",
            titulo = "Concluir Negociação",
            opcoes = ["Sim", "Não"],
            opcaoResolve = "Sim",
            } = {}) {
        return new Promise(function(fnResolve) {
            sap.m.MessageBox.confirm(pergunta, {
                title: titulo,
                actions: opcoes,
                onClose: function(sActionClicked) {
                    fnResolve(sActionClicked === opcaoResolve);
                }
            });
        });
    },

    temCertezaQueDesejaFinalizar: function() {
        return this.temCerteza();
    },

    refresh: function() {
        this.getModel().refresh();
        // @todo Verificar por que funciona sem considerar execução asincrona.
        this.adaptarView();
    },

    changeStatusNegociacao: async function({
            temCertezaOptions = {},
            functionImportPath = '/FinalizarNegociacao',
            successMessage = undefined,
            errorMessage = "Aconteceram erros ao tentar concluir.",
            } = {}) {

        if (this.getModel().hasPendingChanges()){
            MessageToast.show("Ainda tem modificações pendente. Por favor Salvar ou Cancelar.")
            return;
        }

        if (!(await this.temCerteza(temCertezaOptions)))
            return;

        let sNegociacaoID = this.getView().getBindingContext().getProperty('ID');
        let sNegociacaoTipo = this.getView().getBindingContext().getProperty('TipoNegociacao');

        try {
            this.setBusy();
            this.removeAllMessages();
            await this.callFunctionImport(functionImportPath, {ID: sNegociacaoID});            
            let sMessage = successMessage;
            if (!sMessage)
                sMessage = this.formatter.finalizarMessage(sNegociacaoTipo);
            MessageToast.show(sMessage);
            this.refresh()
        } catch (e) {
            MessageToast.show(errorMessage);
            this.error(e);
        } finally{
            this.setFree();
        }

    },

    onFinalizar: function() {
        return this.changeStatusNegociacao();
    },

    temCertezaQueDesejaFormalizar: function(attribute) {
        return new Promise(function(fnResolve) {
            sap.m.MessageBox.confirm("Tem certeza que deseja formalizar a negociação?", {
                title: "Formalizar Negociação",
                actions: ["Sim", "Não"],
                onClose: function(sActionClicked) {
                    fnResolve(sActionClicked === "Sim");
                }
            });
        });
    },

    onFormalizar: async function() {

        if (!(await this.temCertezaQueDesejaFormalizar()))
            return;

        let sNegociacaoID = this.getView().getBindingContext().getProperty('ID');

        try {
            this.setBusy();
            this.removeAllMessages();
            await this.callFunctionImport('/FormalizarNegociacao',{ID: sNegociacaoID});
            MessageToast.show("Formalização realizada com sucesso.");
            this.refresh()
        } catch (e) {
            MessageToast.show("Aconteceram erros ao tentar formalizar.");
            this.error(e);
        } finally{
            this.setFree();
        }

    },

    eliminarNegociacao: function() {
        let v = this.getView();
        let m = v.getModel();
        return new Promise( 
            (resolve, reject) => {
                m.remove(v.getBindingContext().getPath(),{
                    success: (...args) => resolve(args),
                    error: (...args) => reject(args),
                    })
            }
        );
        
    },

    temCertezaDeEliminarNegociacao: function() {
        return new Promise(function(fnResolve) {
            sap.m.MessageBox.confirm("Tem certeza que deseja eliminar a negociação?", {
                title: "Eliminar Negociação",
                actions: ["Sim", "Não"],
                onClose: function(sActionClicked) {
                    fnResolve(sActionClicked === "Sim");
                }
            });
        })
    },

    onEliminarNegociacao: async function() {
        let eliminar = await this.temCertezaDeEliminarNegociacao();
        if (!eliminar)
            return;
        try {
            this.setBusy();
            this.removeAllMessages();
            let sTipoNegociacao = this.getView().getBindingContext().getProperty('tipoNegociacao/ID');
            await this.eliminarNegociacao();
            MessageToast.show("Eliminação realizada com sucesso.");
            this.getView().unbindObject();
            this.navTo('TaskList', {tipoNegociacaoID: sTipoNegociacao});
        } catch (e) {
            MessageToast.show("Aconteceram erros ao tentar eliminar.");
            this.error(e);
        } finally{
            this.setFree();
        }
    },

    onLiveChangeDescricao: function(oEvent) {
        let sValue = oEvent.getParameter('value');
        oEvent.getSource().setValue(
            sValue.toUpperCase());
    },

    _resetSortingState: function (oTable){
			
        var aColumns = oTable.getColumns();
        for (var i = 0; i < aColumns.length; i++) {
            aColumns[i].setSorted(false);
        }
    },

    getSorters: function(oEvent) {

        let oCurrentColumn = oEvent.getParameter("column");

        oEvent.preventDefault();

        let sOrder = oEvent.getParameter("sortOrder");

        let oTable = oEvent.getSource();
        this._resetSortingState(oTable);
        oCurrentColumn.setSorted(true);
        oCurrentColumn.setSortOrder(sOrder);

        return [new Sorter(oCurrentColumn.getSortProperty(), sOrder === "Descending" )];

    },

    doSortItemsNegociacao: function(aSorters) {

        let oBinding = this.getView().byId('treeTable').getBinding("rows");
        oBinding.sort(aSorters);
        
    },

    sortItemsNegociacao: function (oEvent){

        let aSorters = this.getSorters(oEvent);
        this.doSortItemsNegociacao(aSorters);

    },

    onFecharFilterItemsPopover: function() {
        this.getView().byId('filterItemsPopover').close();
    },

    createItemsFilters: function() {

        let aFilters = []

        let v = this.getView();
        let m = v.getModel('view');
        let filter = m.getData().itemsFilter;

        filter.fornecedores.forEach( sValue => 
            aFilters.push(new Filter('FornecedorID', FilterOperator.EQ, sValue)));

        filter.itemsMerc.forEach( sValue => 
            aFilters.push(new Filter('MaterialID', FilterOperator.EQ, sValue)));

        filter.itemsOrg.forEach( sValue => 
            aFilters.push(new Filter('OrgID', FilterOperator.EQ, sValue)));

        return aFilters;
 
    },

    setItemsFilters: function(aFilters) {
        this.getView().byId('treeTable').getBinding('rows').filter(aFilters, FilterType.Application);
    },

    onFiltrarItems: function() {
        let aFilters = this.createItemsFilters();
        this.setItemsFilters(aFilters);
    },

    onLimparFiltroItems: function(){

        let v = this.getView();
        let m = v.getModel('view');
        let filter = m.getData().itemsFilter;

        filter.fornecedores = [];
        filter.itemsMerc = [];
        filter.itemsOrg = [];

        m.setProperty('/itemsFilter', filter);

        this.setItemsFilters([]);

    },

    refreshItemsFilters: function() {
        [
            "fornecedorMultiComboBox",
            "itemMercMultiComboBox",
            "itemOrgMultiComboBox",
            ]
            .map( sIDMultiComboBox => this.getView().byId(sIDMultiComboBox) )
            .map( oMultiComboBox => oMultiComboBox.getBinding('items') )
            .forEach( oBinding => oBinding.refresh() );
        this.onLimparFiltroItems();
    },

});

