sap.ui.define([
		"cp/simplifique/telaneg/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History"
	], function (BaseController, JSONModel, History) {
		"use strict";

		return BaseController.extend("cp.simplifique.telaneg.controller.App", {

			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
				this.setModel(oViewModel, "appView");

                // apply content density mode to root view
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            
                return new Promise(function (fnResolve) {
                    
                    var oModel, aPromises = [];
                        oModel = this.getOwnerComponent().getModel();
                        aPromises.push(oModel.metadataLoaded);
                    return Promise.all(aPromises).then(function () {
                        oViewModel.setProperty("/busy", false);
                        oViewModel.setProperty("/delay", iOriginalBusyDelay);
                        fnResolve();
                    });
                }.bind(this));
			}
		});
	}
);
