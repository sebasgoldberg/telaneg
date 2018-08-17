import UIComponent from "sap/ui/core/UIComponent";
import Device from "sap/ui/Device";
import models from "simplifique/telaneg/model/models";
import ErrorHandler from "simplifique/telaneg/controller/ErrorHandler";
import ImpostosPopover from "simplifique/telaneg/controller/ImpostosPopover";
import SelecaoLojaDialog from "simplifique/telaneg/controller/SelecaoLojaDialog";
import SelecaoMaterialFornecedorDialog from "simplifique/telaneg/controller/SelecaoMaterialFornecedorDialog";
import babelPolyfill from "simplifique/telaneg/lib/polyfill";

let navigationWithContext = {
    "NegociacaoSet": {
        "DetailPage1": "",
        "DetailPage2": "item"
    },
    "ItemNegociacaoSet": {
        "DetailPage2": ""
    }
};

export default UIComponent.extend("simplifique.telaneg.Component", {

    metadata: {
        manifest: "json"
    },

    setBusy: function() {
        //sap.ui.core.BusyIndicator.show(0);
    },

    setFree: function() {
        //sap.ui.core.BusyIndicator.hide();
    },

    submitChanges: function() {

        return new Promise( (resolve, reject) => {
            this.getModel().submitChanges({
                    success: (...args) => resolve(args),
                    error: (...args) => reject(args),
                });
            });
    },

    save: async function() {
        let m = this.getModel();

        if (!m.hasPendingChanges())
            return;

        try {
            this.setBusy();
            let result = await this.submitChanges();
            m.refresh(true);
        } catch (e) {
            console.error(e);
            m.resetChanges();
        } finally{
            this.setFree();
        }
    },

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * In this method, the FLP and device models are set and the router is initialized.
     * @public
     * @override
     */
    init: function() {
        this._oErrorHandler = new ErrorHandler(this);
        // set the device model
        this.setModel(models.createDeviceModel(), "device");
        // set the FLP model
        this.setModel(models.createFLPModel(), "FLP");

        // set the dataSource model
        this.setModel(new sap.ui.model.json.JSONModel({
            "uri": "/here/goes/your/serviceUrl/local/"
        }), "dataSource");

        // set application model
        var oApplicationModel = new sap.ui.model.json.JSONModel({});
        this.setModel(oApplicationModel, "applicationModel");

        // call the base component's init function and create the App view
        UIComponent.prototype.init.apply(this, arguments);

        // create the views based on the url/hash
        this.getRouter().initialize();

        this.getModel().attachPropertyChange(oEvent => this.save());

        let oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
        let oMessageManager  = sap.ui.getCore().getMessageManager();

        oMessageManager.registerMessageProcessor(oMessageProcessor);

        this._impostosPopover = new ImpostosPopover(this.getRootControl());
        this._selecaoLojaDialog = new SelecaoLojaDialog(this.getRootControl());
        this._selecaoMaterialFornecedorDialog = new SelecaoMaterialFornecedorDialog(this.getRootControl());
    },

    getImpostosPopover: function() {
        return this._impostosPopover;
    },

    getSelecaoLojaDialog: function() {
        return this._selecaoLojaDialog;
    },

    getSelecaoMercadoriaFornecedorDialog: function() {
        return this._selecaoMaterialFornecedorDialog;
    },

    /**
     * The component is destroyed by UI5 automatically.
     * In this method, the ListSelector and ErrorHandler are destroyed.
     * @public
     * @override
     */
    destroy: function() {
        this._oErrorHandler.destroy();
        // call the base component's destroy function
        UIComponent.prototype.destroy.apply(this, arguments);
    },

    /**
     * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
     * design mode class should be set, which influences the size appearance of some controls.
     * @public
     * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
     */
    getContentDensityClass: function() {
        if (this._sContentDensityClass === undefined) {
            // check whether FLP has already set the content density class; do nothing in this case
            if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
                this._sContentDensityClass = "";
            } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                this._sContentDensityClass = "sapUiSizeCompact";
            } else {
                // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                this._sContentDensityClass = "sapUiSizeCozy";
            }
        }
        return this._sContentDensityClass;
    },

    getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
        var entityNavigations = navigationWithContext[sEntityNameSet];
        return entityNavigations == null ? null : entityNavigations[targetPageName];
    }

});

