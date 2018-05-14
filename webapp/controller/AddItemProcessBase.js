export default class AddItemProcessBase{
    
    constructor(oController, fragmentId, fragmentPath, listWithSelectionsId, navContainerId){
        this.oController = oController;
        this.fragmentId = fragmentId;
        this.fragmentPath = fragmentPath;
        this.listWithSelectionsId = listWithSelectionsId;
        this.navContainerId = navContainerId;
    }

    getView(){
        return this.oController.getView();
        }

    getModel(sModel=''){
        return this.getView().getModel(sModel)
        }

    toogleAddItemPopover(oEvent){
        if (!oEvent)
            return;
        if (!this.popover) {
            this.popover = sap.ui.xmlfragment(
                this.fragmentId,
                this.fragmentPath,
                this);
            this.oController.getView().addDependent(this.popover);
        }
        if (this.popover.isOpen())
            this.popover.close()
        else
            this.popover.openBy(oEvent.getSource());
        }

    addItems(oSelectedContexts){

        let v = this.oController.getView();
        let m = v.getModel();

        // @todo Codigo sync, deveria ser adaptado para ser async.
        oSelectedContexts.forEach( oContextGrupoLista => {

            this.addItemsForContext(oContextGrupoLista);

            });

        m.submitChanges();
        v.byId('itemsTable').getBinding('items').refresh();
        this.popover.close();
        }

    onCancel(oEvent){
        this.popover.close();
        }

    onNavBack(){
        let oNavCon = sap.ui.core.Fragment.byId(this.fragmentId, this.navContainerId);
        oNavCon.back();
        }

    onAdd(oEvent){
        let oListGruposListas = sap.ui.core.Fragment.byId(this.fragmentId, this.listWithSelectionsId);
        let oSelectedContexts = oListGruposListas.getSelectedContexts();
        this.addItems(oSelectedContexts);
        }

}

