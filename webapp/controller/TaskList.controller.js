import Controller from 'simplifique/telaneg/controller/BaseController';
import formatter from 'simplifique/telaneg/model/formatter';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';
import JSONModel from "sap/ui/model/json/JSONModel";

export default Controller.extend("simplifique.telaneg.controller.TaskList", {

    formatter: formatter,

    onInit: function(){

        Controller.prototype.onInit.call(this);

        let v = this.getView();
        v.setModel(new JSONModel({
            filter: {
                descricao: null,
                status: [],
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
            .attachDisplay( oEvent => {

                this.sTipoNegociacaoID = oEvent.mParameters.data.tipoNegociacaoID;
                let oPath = {
                    path: `/TipoNegociacaoSet('${this.sTipoNegociacaoID}')/`,
                    parameters: {},
                };

                this.getView().bindObject(oPath);

                this._setListBinding();

            });
    },

    suggestFornecedores: async function(oEvent) {
        var sTerm = oEvent.getParameter("suggestValue");
        var aFilters = [];
        if (sTerm) {
            aFilters.push(new Filter("Nome", FilterOperator.Contains, sTerm));
        }
        oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
    },


    _createFilters: function() {
        let aFilters = []

        let v = this.getView();
        let m = v.getModel('view');
        let filter = m.getData().filter;

        if (filter.descricao)
            aFilters.push(new Filter('Descricao', FilterOperator.Contains, filter.descricao));

        filter.status.forEach( statusID => 
            aFilters.push(new Filter('Status', FilterOperator.EQ, statusID)));

        let oMultiInputFornecedor = v.byId('multiInputFornecedor');
        oMultiInputFornecedor.getTokens().map( oToken =>
            aFilters.push(new Filter('FornecedorID', FilterOperator.EQ, oToken.getKey() )));

        if (filter.dataDe)
            aFilters.push(new Filter('Data', FilterOperator.BT, filter.dataDe, filter.dataAte));

        return aFilters;
        
    },

    _setListBinding: function(aFilters=[]) {

        let v = this.getView();
        let oNegociacoesTable = v.byId('negociacoesTable');
        aFilters.push(new Filter('TipoNegociacao', FilterOperator.EQ, this.sTipoNegociacaoID));

        let oBindingInfo = oNegociacoesTable.getBindingInfo('items');
        oNegociacoesTable.bindAggregation('items', {
            model: oBindingInfo.model,
            path: oBindingInfo.path,
            parameters: {
                expand: 'fornecedor,status',
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
            FornecedorID: novoAcordo.fornecedor,
            FornecedorType: 'C', // Cadastrado
            Bandeira: novoAcordo.bandeira,
            Abrangencia: ''
        });
    },


    onCriarAcordo: async function(oEvent) {
        try {
            this.setBusy();
            let result = await this.createAcordo();
            this._closeNovoAcordoPopOver();
            this.getModel().refresh();
            this.getRouter().navTo('DetailPage1', {
                context: `NegociacaoSet('${result[0].ID}')`,
            }, false);
            //@todo Navigate.
        } catch (e) {
            this.getModel().resetChanges();
            console.error(e);
        } finally{
            this.setFree();
        }



        try {
            //this.doNavigate('DetailPage1', oContext);

        } catch (e) {
            console.error(e);
        } finally{
            this.setFree();
        }
    },

    onShowDetail: function(oEvent) {
        let sNegociacaoID = oEvent.getSource().getBindingContext().getObject().ID;
        this.navTo('TaskDetail', {negociacaoID: sNegociacaoID});
    },


});
