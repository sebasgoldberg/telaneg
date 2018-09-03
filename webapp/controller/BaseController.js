import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default Controller.extend("simplifique.telaneg.controller.BaseController", {

    onInit: function(){
    },

    /**
     * Convenience method for accessing the router in every controller of the application.
     * @public
     * @returns {sap.ui.core.routing.Router} the router for this component
     */
    getRouter : function () {
        return this.getOwnerComponent().getRouter();
    },

    /**
     * Convenience method for getting the view model by name in every controller of the application.
     * @public
     * @param {string} sName the model name
     * @returns {sap.ui.model.Model} the model instance
     */
    getModel : function (sName) {
        return this.getView().getModel(sName);
    },

    /**
     * Convenience method for setting the view model in every controller of the application.
     * @public
     * @param {sap.ui.model.Model} oModel the model instance
     * @param {string} sName the model name
     * @returns {sap.ui.mvc.View} the view instance
     */
    setModel : function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
    },

    /**
     * Convenience method for getting the resource bundle.
     * @public
     * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
     */
    getResourceBundle : function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    },

    /**
     * Event handler  for navigating back.
     * It checks if there is a history entry. If yes, history.go(-1) will happen.
     * If not, it will replace the current entry of the browser history with the master route.
     * @public
     */
    onNavBack : function() {
        var sPreviousHash = History.getInstance().getPreviousHash();

        if (sPreviousHash !== undefined) {
            // The history contains a previous entry
            history.go(-1);
        } else {
            // Otherwise we go backwards with a forward history
            var bReplace = true;
            this.getRouter().navTo("master", {}, bReplace);
        }
    },

    all: function(aPromises) {
        return new Promise((resolve, reject) => {
            Promise.all(aPromises)
                .then( (...args) => resolve(args) )
                .catch( (...args) => reject(args) );
        });
    },

    resetChanges: function() {
        this.getModel().resetChanges();
    },

    submitChanges: function() {
        let m = this.getModel();
        return new Promise((resolve, reject) => {
            m.submitChanges({
                success: (...args) => resolve(args),
                error: (...args) => reject(args),
                });
        });
        
    },

    createEntry: function(entitySetPath, properties={}, submit=true) {
        return new Promise((resolve, reject) => {
            let v = this.getView();
            let m = v.getModel();
            let oNegociacao = v.getBindingContext().getObject();
            let sPathNegociacao = v.getBindingContext().getPath();
            m.createEntry(
                entitySetPath, 
                {
                    properties: properties,
                    success: (...args) => resolve(args),
                    error: (...args) => reject(args),
                });
            if (submit)
                m.submitChanges({
                    error: (...args) => reject(args),
                    });
        });
    },

    setBusy: function() {
        sap.ui.core.BusyIndicator.show(0);
    },

    setFree: function() {
        sap.ui.core.BusyIndicator.hide();
    },

    navTo: function(routeName, ...args) {
        this.getRouter().navTo(routeName, ...args, false);
    },

    remove: function(...args){
        return this.getOwnerComponent().remove(...args);
    },

    error: function(...args) {
        this.getOwnerComponent().error(...args)
    },

    temCertezaDeEliminar: function(attribute) {
        return new Promise(function(fnResolve) {
            sap.m.MessageBox.confirm("Tem certeza que deseja eliminar os itens selecionados?", {
                title: "Eliminar Items Selecionados",
                actions: ["Tenho Sim", "Melhor Não"],
                onClose: function(sActionClicked) {
                    fnResolve(sActionClicked === "Tenho Sim");
                }
            });
        });
    },


    deleteContextsPromises: function(aContexts) {
        let v = this.getView();
        return aContexts.map( c => c.getPath() )
            .map( c => this.remove(c) );
    },

    deleteContexts: function(aContexts) {
        return new Promise( async (resolve, reject) => {
            let v = this.getView();
            let m = v.getModel();

            let eliminar = await this.temCertezaDeEliminar();
            if (!eliminar){
                resolve(false);
                return;
            }
            try {
                let result = await this.all(
                    this.deleteContextsPromises(aContexts)
                );
                if (result)
                    resolve(true)
                else
                    resolve(false);
            } catch (e) {
                this.error(e);
                resolve(false);
            }
        });
    },

    deleteSelectedItems: async function(sControlId) {
        let v = this.getView();
        let m = v.getModel();

        let eliminar = await this.temCertezaDeEliminar();
        if (!eliminar)
            return false;
        
        let oControl = v.byId(sControlId);

        try {

            oControl.setBusy(true);

            let result = await this.all(
                this.deleteContextsPromises(
                    oControl.getSelectedContexts()
                )
            );
        
            if (result)
                oControl.getBinding('items').refresh();

        } catch (e) {
            this.error(e);
        } finally {
            oControl.setBusy(false);
        }
    },

    suggestFornecedores: function(oEvent) {
        var sTerm = oEvent.getParameter("suggestValue");
        var aFilters = [];
        if (sTerm) {
            aFilters.push(new Filter("Nome", FilterOperator.Contains, sTerm));
            if (sTerm.length == 10)
                aFilters.push(new Filter("ID", FilterOperator.EQ, sTerm))
            else if (sTerm.length == 9){
                aFilters.push(new Filter("ID", FilterOperator.StartsWith, sTerm))
                aFilters.push(new Filter("ID", FilterOperator.EndsWith, sTerm))
                }
            else
                aFilters.push(new Filter("ID", FilterOperator.Contains, sTerm));
        }
        let oSource = oEvent.getSource();
        let oBinding = oSource.getBinding("suggestionItems")
        oBinding.filter(aFilters);
    },

    suggestMateriais: function(oEvent) {
        var sTerm = oEvent.getParameter("suggestValue");
        var aFilters = [];
        if (sTerm) {
            if (/^\d+$/.test(sTerm)) // Só numeros
                if (sTerm.length == 18)
                    aFilters.push(new Filter("ID", FilterOperator.EQ, sTerm))
                else if (sTerm.length == 17){
                    aFilters.push(new Filter("ID", FilterOperator.StartsWith, sTerm))
                    aFilters.push(new Filter("ID", FilterOperator.EndsWith, sTerm))
                    }
                else
                    aFilters.push(new Filter("ID", FilterOperator.Contains, sTerm))
            else
                aFilters.push(new Filter("Nome", FilterOperator.Contains, sTerm));
        }
        let oSource = oEvent.getSource();
        let oBinding = oSource.getBinding("suggestionItems")
        oBinding.filter(aFilters);
    },


    hasToPerformSave: function() {
        return new Promise(function(fnResolve) {
            sap.m.MessageBox.confirm("É necessario gravar as modificações antes de realizar a operação solicitada. Deseja gravar?", {
                title: "Gravar Modificações",
                actions: ["Desejo Sim", "Melhor Não"],
                onClose: function(sActionClicked) {
                    fnResolve(sActionClicked === "Desejo Sim");
                }
            });
        });
    },

    saveIfNeeded: function() {
        return new Promise( async (resolve, reject) => {

            let m = this.getModel();

            if (!m.hasPendingChanges()){
                resolve(true);
                return;
            }

            let performSave = await this.hasToPerformSave();
            if (!performSave){
                resolve(false);
                return;
            }

            resolve(await this.save());
            
        });
    },

    save: function() {
        return new Promise( async (resolve, reject) => {
            let m = this.getModel();

            if (!m.hasPendingChanges()){
                resolve(true);
                return;
            }

            try {
                this.setBusy();
                let result = await this.submitChanges();
                m.refresh(true);
                resolve(true)
            } catch (e) {
                console.error(e);
                m.resetChanges();
                resolve(false);
            } finally{
                this.setFree();
            }
        });
    },

    reset: function() {
        let m = this.getModel();
        m.resetChanges();
    },

    onSave: function() {
        this.save();
    },

    onReset: function() {
        this.reset();
    },


});
