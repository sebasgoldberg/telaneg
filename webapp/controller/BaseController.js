import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";

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

    remove: function(sPath, urlParameters){
        let m = this.getModel();
        return new Promise( (resolve, reject) => {
            m.remove(
                sPath,
                {
                    success: (...args) => { resolve(...args) },
                    error: (...args) => { reject(...args) },
                    urlParameters: urlParameters,
                    headers: urlParameters,
                }
            );
        });
    },

    error: function(e) {
        console.error(e);
    },
    

});
