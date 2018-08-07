import Controller from "sap/ui/core/mvc/Controller";
import formatter from 'simplifique/telaneg/model/formatter';
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default Controller.extend("simplifique.telaneg.controller.TaskList", {

    formatter: formatter,

    onInit: function(){

        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getTarget("TaskList")
            .attachDisplay( oEvent => {

                var oParams = {
                    //"expand": "tipoNegociacao,bandeira"
                    };

                this.sTipoNegociacaoID = oEvent.mParameters.data.tipoNegociacaoID;
                let oPath = {
                    path: `/TipoNegociacaoSet('${this.sTipoNegociacaoID}')/`,
                    parameters: oParams,
                };

                this.getView().bindObject(oPath);

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

});
