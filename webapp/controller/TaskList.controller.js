import Controller from 'simplifique/telaneg/base/controller/BaseController';
import formatter from 'simplifique/telaneg/base/model/formatter';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from 'sap/m/MessageToast';
import TiposNegociacoes from 'simplifique/telaneg/base/model/TiposNegociacoes';

export default Controller.extend("simplifique.telaneg.base.controller.TaskList", {

    formatter: formatter,

    onInit: function(){

        Controller.prototype.onInit.call(this);

        this.popupInformativoExibido = {};

        this.getView().setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"message");

        let v = this.getView();
        v.setModel(new JSONModel({
            filter: {
                descricao: null,
                status: [],
                bandeiras: [],
                dataDe: null,
                dataAte: null,
            },
            novoAcordo: {
                isCriacaoPossivel: false,
                fornecedor: null,
                bandeira: null,
                tipoAbrangencia: null,
            },
        }), 'view');

        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getTarget("TaskList")
            .attachDisplay( async (oEvent) => {

                this.sTipoNegociacaoID = oEvent.mParameters.data.tipoNegociacaoID;                

                this.tipoNegociacao = (new TiposNegociacoes(this.getView())).getTipoNegociacao(this.sTipoNegociacaoID);
                this.tipoNegociacao.adaptarTaskListView();

                let oPath = {
                    path: `/TipoNegociacaoSet('${this.sTipoNegociacaoID}')/`,
                    parameters: {
                        expand: 'info',
                    },
                };

                await this.bindObject(oPath);

                this.exibirPopupInformativoSeAplicar();

                this.filtrarPorUsuario();

                this.onSearch();             

            });
    },

    filtrarPorUsuario: function() {
        if (this.filtroUsuarioJaAplicado)
            return;
        this.filtroUsuarioJaAplicado = true;
        let sUser = this.getOwnerComponent().getUserInfo().getId();
        let oMultiInput = this.getView().byId('multiInputUsuario');
        let oToken = new sap.m.Token()
        oToken.setKey(sUser);
        oToken.setText(sUser);
        oMultiInput.addToken(oToken);
    },

    exibirPopupInformativoSeAplicar: function() {

        if (this.popupInformativoExibido[this.sTipoNegociacaoID])
            return;
        this.popupInformativoExibido[this.sTipoNegociacaoID] = true;

        let bc = this.getView().getBindingContext();
        let bExibirPopupInfo = ! bc.getProperty('info/OcultarPopupInfo');

        if (!bExibirPopupInfo)
            return;

        let oPopupInfo = this.getOwnerComponent().getInfoDialog();
        let sPath = bc.getPath();
        oPopupInfo.open(sPath);

    },

    _createFilters: function() {
        let aFilters = []

        let v = this.getView();
        let m = v.getModel('view');
        let filter = m.getData().filter;

        if (filter.descricao){
            if (/^\d+$/.test(filter.descricao))
                aFilters.push(new Filter("ID", FilterOperator.EQ, filter.descricao))
            else
                aFilters.push(new Filter('Descricao', FilterOperator.Contains, filter.descricao));
        }

        filter.status.forEach( statusID => 
            aFilters.push(new Filter('Status', FilterOperator.EQ, statusID)));

        filter.bandeiras.forEach( ID => 
            aFilters.push(new Filter('Bandeira', FilterOperator.EQ, ID)));

        let oMultiInputFornecedor = v.byId('multiInputFornecedor');
        oMultiInputFornecedor.getTokens().map( oToken =>
            aFilters.push(new Filter('FornecedorID', FilterOperator.EQ, oToken.getKey() )));

        if (filter.dataDe)
            aFilters.push(new Filter('ApuracaoAte', FilterOperator.BT, filter.dataDe, filter.dataAte));

        let oMultiInputMaterial = v.byId('multiInputMaterial');
        oMultiInputMaterial.getTokens().map( oToken =>
            aFilters.push(new Filter('MaterialID', FilterOperator.EQ, oToken.getKey() )));

        let oMultiInputUsuario = v.byId('multiInputUsuario');
        oMultiInputUsuario.getTokens().map( oToken =>
            aFilters.push(new Filter('Usuario', FilterOperator.EQ, oToken.getKey() )));

        return aFilters;
        
    },

    _setListBinding: function(aFilters=[]) {

        let v = this.getView();
        let oNegociacoesTable = v.byId('negociacoesTable');        

        aFilters.push(new Filter('TipoNegociacao', FilterOperator.EQ, this.sTipoNegociacaoID));
        
        var vExpand = 'fornecedor,status,bandeira';
        if (this.sTipoNegociacaoID == 'P') {
            vExpand = 'fornecedor,status,comentarioImpressao,bandeira'; 
        }

        let oBindingInfo = oNegociacoesTable.getBindingInfo('items');
        oNegociacoesTable.bindAggregation('items', {
            model: oBindingInfo.model,
            path: '/NegociacaoSet',
            parameters: {
                //expand: 'fornecedor,status',
                expand: vExpand,
                },
            template: oBindingInfo.template,
            templateShareable: true,
            //sorter: oBindingOptions.sorters,
            sorter: [
                new sap.ui.model.Sorter("Data", true),
                new sap.ui.model.Sorter("ID", true),
                ],
            filters: aFilters,
        });

    },

    onSearch(oEvent) {

        let aFilters = this._createFilters();
        this._setListBinding(aFilters);

    },

    _closeNovoAcordoPopOver: function() {
        this.getView().byId('novoAcordoPopover').close()
    },

    onCancelCriarAcordo: function() {
        this._closeNovoAcordoPopOver();
    },

    createAcordo: function(attribute) {
        let novoAcordo = this.getModel('view').getData().novoAcordo;
        return this.createEntry('/NegociacaoSet',{
            TipoNegociacao: this.sTipoNegociacaoID,
        });
    },

    onCriarAcordo: async function(oEvent) {
        try {
            this.setBusy();
            let result = await this.createAcordo();
            this.getModel().refresh();
            this.navTo('TaskDetail', {negociacaoID: result[0].ID});
        } catch (e) {
            this.getModel().resetChanges();
            console.error(e);
            MessageToast.show("Aconteceu um erro ao tentar criar a negociação.");
        } finally{
            this.setFree();
        }
    },

    onShowDetail: function(oEvent) {
        let oListItem = oEvent.getParameter('listItem');
        let sNegociacaoID = oListItem.getBindingContext().getObject().ID;
        this.navTo('TaskDetail', {negociacaoID: sNegociacaoID});
    },

    onTokenUpdate: function(oEvent) {
        setTimeout( () => this.onSearch(), 100);
    },

    onDeleteSelecionados: function(oEvent) {
        this.deleteSelectedItems('negociacoesTable');
    },

    onCopiarSelecionados: async function(oEvent) {
        let aSelectedContexts = this.getView().byId('negociacoesTable').getSelectedContexts();
        if (aSelectedContexts.length == 0){            
            MessageToast.show("Deve selecionar as negociações a serem copiadas.");
            return;
        }
        let aCopiaPromises = aSelectedContexts
            .map( c => c.getProperty('ID') )
            .map( ID => this.callFunctionImport('/CopiarNegociacao',{ID: ID}));

        try {
            this.setBusy();
            this.removeAllMessages();
            await this.all(aCopiaPromises);
            MessageToast.show("Negociações copiadas com sucesso.");
        } catch (e) {
            MessageToast.show("Aconteceu um erro ao tentar copiar as negociações.");
            this.error(e);
        } finally{
            this.onSearch();
            this.setFree();
        }


    },

    onMostrarAnexos: function(oEvent) {
        let oSource = oEvent.getSource();
        let sNegociacaoPath = oSource.getBindingContext().getPath();
        let oAnexosNegociacaoDialog = this.getOwnerComponent().getAnexosNegociacaoDialog();
        oAnexosNegociacaoDialog.open(sNegociacaoPath);
    },

    onMostrarAnexosEstipulacao: function(oEvent) {
        let oSource = oEvent.getSource();
        let sNegociacaoPath = oSource.getBindingContext().getPath();
        let oAnexosEstipulacaoDialog = this.getOwnerComponent().getAnexosEstipulacaoDialog();
        oAnexosEstipulacaoDialog.open(sNegociacaoPath, {uploadEnabled: false});
    },

    onGetPDF: function(oEvent) {
        let oSource = oEvent.getSource();
        let sNegoPath = oSource.getBindingContext().getPath();
        try {
            let sUrl = this.getOwnerComponent().getUrlContent(`${sNegoPath}/pdf`);
            this.openUrl(sUrl);
        } catch (e) {
            this.error(e);
        }
    },

    clearVencimentoDateRangeSelection: function(oEvent) {
        let oVencimentoDateRangeSelection = this.getView().byId('vencimentoDateRangeSelection');
        oVencimentoDateRangeSelection.setValue();
        this.onSearch();
    },

});
