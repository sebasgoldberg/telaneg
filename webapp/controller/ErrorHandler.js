sap.ui.define([
        "sap/ui/base/Object",
        "sap/m/MessageBox"
    ], function (UI5Object, MessageBox) {
        "use strict";

        return UI5Object.extend("simplifique.telaneg.base.controller.ErrorHandler", {

            /**
             * Handles application errors by automatically attaching to the model events and displaying errors when needed.
             * @class
             * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
             * @public
             * @alias simplifique.telaneg.base.controller.ErrorHandler
             */
            constructor : function (oComponent) {
                this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
                this._oComponent = oComponent;
                this._bMessageOpen = false;
                this._sErrorText = this._oResourceBundle.getText("errorText");
                var oModel;
            
                    oModel = this._oComponent.getModel();
                    if (oModel) {
                        oModel.attachMetadataFailed(function (oEvent) {
                            var oParams = oEvent.getParameters();
                            this._showMetadataError(oParams.response, oModel);
                        }, this);
                        oModel.attachRequestFailed(function (oEvent) {
                            var oParams = oEvent.getParameters();
                            var oMessageManager = sap.ui.getCore().getMessageManager();
                            try {

                                let messages = JSON.parse(oParams.response.responseText);

                                let mainMessage = messages.error.message;
                                let detailMessages = messages.error.innererror.errordetails;

                                if (detailMessages.length == 0)
                                    oMessageManager.addMessages(
                                        new sap.ui.core.message.Message({
                                            message: mainMessage.value,
                                            type: sap.ui.core.MessageType.Error,
                                            code: messages.error.code,
                                            processor: oModel,
                                        })
                                    )
                                else
                                    detailMessages.forEach( message =>
                                        oMessageManager.addMessages(
                                            new sap.ui.core.message.Message({
                                                code: message.code,
                                                message: message.message,
                                                type: this.getTypeFromSeverity(message.severity),
                                                target: `${message.propertyref}${message.target}`,
                                                processor: oModel,
                                            })
                                        )
                                    );

                            } catch (e) {
                                console.error(e);
                            }
                            return;

                            // An entity that was not found in the service is also throwing a 404 error in oData.
                            // We already cover this case with a notFound target so we skip it here.
                            // A request that cannot be sent to the server is a technical error that we have to handle though
                            if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf("Cannot POST") === 0)) {
                                this._showServiceError(oParams.response);
                            }
                        }, this);
                    }
            },

            getTypeFromSeverity: function(sSeverity) {
                switch(sSeverity){
                    case "error":
                        return sap.ui.core.MessageType.Error;
                        break;
                    case "info":
                        return sap.ui.core.MessageType.Information;
                        break;
                    case "warning":
                        return sap.ui.core.MessageType.Warning;
                        break;
                }
                return sap.ui.core.MessageType.Error;
            },

            /**
             * Shows a {@link sap.m.MessageBox} when the metadata call has failed.
             * The user can try to refresh the metadata.
             * @param {string} sDetails a technical error to be displayed on request
             * @private
             */
            _showMetadataError : function (sDetails, oModel) {
                MessageBox.error(
                    this._sErrorText,
                    {
                        id : "metadataErrorMessageBox",
                        details : sDetails,
                        styleClass : this._oComponent.getContentDensityClass(),
                        actions : [MessageBox.Action.RETRY, MessageBox.Action.CLOSE],
                        onClose : function (sAction) {
                            if (sAction === MessageBox.Action.RETRY) {
                                oModel.refreshMetadata();
                            }
                        }
                    }
                );
            },

            /**
             * Shows a {@link sap.m.MessageBox} when a service call has failed.
             * Only the first error message will be display.
             * @param {string} sDetails a technical error to be displayed on request
             * @private
             */
            _showServiceError : function (sDetails) {
                if (this._bMessageOpen) {
                    return;
                }
                this._bMessageOpen = true;
                MessageBox.error(
                    this._sErrorText,
                    {
                        id : "serviceErrorMessageBox",
                        details : sDetails,
                        styleClass : this._oComponent.getContentDensityClass(),
                        actions : [MessageBox.Action.CLOSE],
                        onClose : function () {
                            this._bMessageOpen = false;
                        }.bind(this)
                    }
                );
            }

        });

    }
);
