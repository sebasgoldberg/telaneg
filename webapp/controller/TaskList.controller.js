import Controller from "sap/ui/core/mvc/Controller";
import formatter from 'simplifique/telaneg/model/formatter';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';
import JSONModel from "sap/ui/model/json/JSONModel";

export default Controller.extend("simplifique.telaneg.controller.TaskList", {

    formatter: formatter,

    onInit: function(){

        let v = this.getView();
        v.setModel(new JSONModel({
            filter: {
                descricao: '',
                status: [],
                dataDe: null,
                dataAte: null,
            }
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

        let aFiltersStatus = filter.status.map( statusID => 
            new Filter('Status', FilterOperator.EQ, statusID));
        if (aFiltersStatus.length > 0) 
            aFilters.push(new Filter({filters: aFiltersStatus, and: false}));

        let oMultiInputFornecedor = v.byId('multiInputFornecedor');
        let aFiltersFornecedor = oMultiInputFornecedor.getTokens().map( oToken => oToken.getBindingContext().getObject() )
        .map( oFornecedor => new Filter('FornecedorID', FilterOperator.EQ, FornecedorID) )
        if (aFiltersFornecedor.length > 0)
            aFilters.push(new Filter({filters: aFiltersStatus, and: false}));

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



});
