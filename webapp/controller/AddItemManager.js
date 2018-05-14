import UI5Object from "sap/ui/base/Object";
import AddItemProcessTabelaPrecos from "simplifique/telaneg/controller/AddItemProcessTabelaPrecos";
import AddItemProcessSelecaoLivre from "simplifique/telaneg/controller/AddItemProcessSelecaoLivre";

export default class AddItemManager extends UI5Object{

    constructor(oController) {
        super();
        this.addItemProcessTabelaPrecos = new AddItemProcessTabelaPrecos(oController);
        this.addItemProcessSelecaoLivre = new AddItemProcessSelecaoLivre(oController);
    }

    selectAddItemProcess(sTipoNegociacaoID) {

        let TipoNegociacao = {
            TABELA_PRECOS: 'A',
            COMMODITIES: 'B',
            SPOT: 'C',
            };

        switch (sTipoNegociacaoID) {
            case TipoNegociacao.TABELA_PRECOS:
                return this.addItemProcessTabelaPrecos;
            default:
                return this.addItemProcessSelecaoLivre;
        }
    }

}
