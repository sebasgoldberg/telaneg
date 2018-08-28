import ManagedObject from "sap/ui/base/ManagedObject";

export default ManagedObject.extend("simplifique.telaneg.controller.VendasPopover",{

    constructor : function (oView) {
        this._oView = oView;    
    },

    exit : function () {
        delete this._oView;
    },

    open : function (sPath, oOpenBy) {
        if (!this.popoverVendas){
            this.popoverVendas = sap.ui.xmlfragment(this.getView().getId(), "simplifique.telaneg.view.VendasPopover", this);
            this._oView.addDependent(this.popoverVendas);
        }

        this.popoverVendas.bindObject(sPath);

        if (this.popoverVendas.isOpen())
            this.popoverVendas.close()
        else{
            this.popoverVendas.openBy(oOpenBy);
        }

    },

    onFecharPopoverVendas: function() {
        this.popoverVendas.close();
    },

    _onAccept: function(attribute) {
        sap.m.MessageToast.show("Aprovação realizada.");
    },

    _onReject: function(attribute) {
        sap.m.MessageToast.show("Rejeição realizada.");
    },

    getView: function() {
        return this._oView;
    },

    getBindingContext: function() {
        return this.popoverVendas.getBindingContext()
    },

    selectAndAddVenda: function(){
        let v = this.getView();
        let m = v.getModel();
        let sPathItem = this.getBindingContext().getPath();
        //let oViewData = this.getView().getModel('view').getData();
        return new Promise( (resolve, reject) => {
            m.create(`${sPathItem}/venda`,{
                De: this.getView().byId('vendaDeDatePicker').getDateValue(),
                Ate: this.getView().byId('vendaAteDatePicker').getDateValue(),
                },
                {
                    success: (...args) => resolve(args),
                    error: (...args) => reject(args),
                    });
            }
        );
    },

    getVendaTable: function() {
        let v = this.getView();
        return v.byId('vendaTable');
    },

    refreshVenda: function() {
        this.getVendaTable().getBinding('items').refresh();
    },

    setBusy: function() {
        this.getVendaTable().setBusy(true);
    },

    setFree: function() {
        this.getVendaTable().setBusy(false);
    },


    onObterVenda: async function() {
        try {
            this.getPopoverObterVenda().close();
            this.setBusy();
            await this.selectAndAddVenda();
            this.refreshVenda();
        } catch (e) {
            console.error(e);
        } finally {
            this.setFree();
        }
    },

    getPopoverObterVenda: function() {
        return this.getView().byId('popoverObterVenda');
    },

    onFecharObterVenda: function() {
        this.getPopoverObterVenda().close();
    },

    eliminarVenda: function(c){
        let m = this.getView().getModel();
        return new Promise( (resolve, reject) => {
            m.remove(
                c.getPath(),
                {
                    success: (...args) => { resolve(...args) },
                    error: (...args) => { reject(...args) },
                }
            );
        });
    },

    eliminarVendasSelecionadas: function() {
        return Promise.all(this.getVendaTable().getSelectedContexts()
            .map( c => this.eliminarVenda(c) ));
    },

    temCertezaDeEliminar: function(attribute) {
        return new Promise(function(fnResolve) {
            sap.m.MessageBox.confirm("Tem certeza que deseja eliminar as vendas selecionados?", {
                title: "Eliminar Vendas",
                actions: ["Tenho Sim", "Melhor Não"],
                onClose: function(sActionClicked) {
                    fnResolve(sActionClicked === "Tenho Sim");
                }
            });
        });
    },

    onDeleteVenda: async function() {
        try {
            let eliminar = await this.temCertezaDeEliminar();
            if (!eliminar)
                return;
            this.setBusy()
            await this.eliminarVendasSelecionadas();
            this.refreshVenda();
        } catch (e) {
            console.error(e);
        } finally {
            this.setFree();
        }
    },



});

