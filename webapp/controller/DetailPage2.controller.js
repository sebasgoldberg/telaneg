sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    'simplifique/telaneg/model/formatter',
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
], function(BaseController, MessageBox, Utilities, formatter, History, JSONModel) {
    "use strict";

    return BaseController.extend("simplifique.telaneg.controller.DetailPage2", {

        formatter: formatter,

        bindObject: function(sPath){

            var oParams = {
                //"expand": "material,fornecedor,centro,simulacao,impostosEntrada,impostosSaida,informacao,contrato,stock,nossoPricing,vendaActual,vendaAnterior,categoryReview"
                "expand": "material,fornecedor,simulacao,informacao,negociacao,negociacao/tipoNegociacao"
            };

            this.sContext = sPath;
            var oPath;
            if (this.sContext) {
                oPath = {
                    path: this.sContext,
                    parameters: oParams,
                    events: {
                        dataReceived: () => this.setStatusInputImpostos(),
                        },
                };
                this.getView().bindObject(oPath);
            }

        },

        handleRouteMatched: function(oEvent) {

            if (oEvent.mParameters.data.context) {
                this.bindObject("/" + oEvent.mParameters.data.context);
            }
        },

        _onButtonPress: function(oEvent) {

            var oBindingContext = oEvent.getSource().getBindingContext();

            return new Promise(function(fnResolve) {

                this.doNavigate("DetailPage1", oBindingContext, fnResolve, "");
            }.bind(this)).catch(function(err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },
        doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {

            var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
            var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

            var sEntityNameSet;
            if (sPath !== null && sPath !== "") {
                if (sPath.substring(0, 1) === "/") {
                    sPath = sPath.substring(1);
                }
                sEntityNameSet = sPath.split("(")[0];
            }
            var sNavigationPropertyName;
            var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

            if (sEntityNameSet !== null) {
                sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
            }
            if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
                if (sNavigationPropertyName === "") {
                    this.oRouter.navTo(sRouteName, {
                        context: sPath,
                        masterContext: sMasterContext
                    }, false);
                } else {
                    oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
                        if (bindingContext) {
                            sPath = bindingContext.getPath();
                            if (sPath.substring(0, 1) === "/") {
                                sPath = sPath.substring(1);
                            }
                        } else {
                            sPath = "undefined";
                        }

                        // If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
                        if (sPath === "undefined") {
                            this.oRouter.navTo(sRouteName);
                        } else {
                            this.oRouter.navTo(sRouteName, {
                                context: sPath,
                                masterContext: sMasterContext
                            }, false);
                        }
                    }.bind(this));
                }
            } else {
                this.oRouter.navTo(sRouteName);
            }

            if (typeof fnPromiseResolve === "function") {
                fnPromiseResolve();
            }
        },
        _onButtonPress1: function() {
            return new Promise(function(fnResolve) {
                var sTargetPos = "";
                sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
                sap.m.MessageToast.show("O item passará a estar finalizado (operações possíveis: enviar os preços de compra modificados para o portal, gerar os preços de compra no SAP, etc.).", {
                    onClose: fnResolve,
                    duration: 6000 || 3000,
                    at: sTargetPos,
                    my: sTargetPos
                });
            }).catch(function(err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },

        getListSubitems: function() {
            return this.getView().byId('subitemsList');
        },

        gravarItem: function() {
            return new Promise( (resolve, reject) => {
                this.getView().getModel().submitChanges({
                        success: (...args) => resolve(args),
                        error: (...args) => reject(args),
                    });
                });
        },

        onGravar: async function() {
            let v = this.getView();
            let m = v.getModel();

            if (!m.hasPendingChanges())
                return;

            try {
                this.setBusy();
                let result = await this.gravarItem();
                //m.resetChanges();
                m.refresh(true);
            } catch (e) {
                console.error(e);
            } finally{
                this.setFree();
            }

        },

        _onButtonPress3: function() {
            return new Promise(function(fnResolve) {
                sap.m.MessageBox.confirm("Tem certeza que deseja eliminar o item da negociação?", {
                    title: "Eliminar Item de Negociação",
                    actions: ["Tenho Sim", "Melhor Não"],
                    onClose: function(sActionClicked) {
                        fnResolve(sActionClicked === "Tenho Sim");
                    }
                });
            }).catch(function(err) {
                if (err !== undefined) {
                    MessageBox.error(err);
                }
            });

        },

        onInit: function() {
            this.getView().setModel(new JSONModel({
                ocultarInformacoesAtuais: false,
                impostos: {
                    enabled: true,
                    },
                venda: {
                    selecao:{
                        de: new Date(),
                        ate: new Date(),
                        },
                    },
                }),'view');
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("DetailPage2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            var oView = this.getView();
            oView.addEventDelegate({
                onBeforeShow: function() {
                    if (sap.ui.Device.system.phone) {
                        var oPage = oView.getContent()[0];
                        if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
                            oPage.setShowNavButton(true);
                            oPage.attachNavButtonPress(function() {
                                this.oRouter.navTo("DetailPage1", {}, true);
                            }.bind(this));
                        }
                    }
                }.bind(this)
            });
        },

        _onAccept: function(attribute) {
            sap.m.MessageToast.show("Aprovação realizada.");
        },

        _onReject: function(attribute) {
            sap.m.MessageToast.show("Rejeição realizada.");
        },

        selectAndAddVenda: function(){
            let v = this.getView();
            let m = v.getModel();
            let sPathItem = v.getBindingContext().getPath();
            let oViewData = this.getView().getModel('view').getData();
            return new Promise( (resolve, reject) => {
                m.create(`${sPathItem}/venda`,{
                    De: oViewData.venda.selecao.de,
                    Ate: oViewData.venda.selecao.ate,
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
            sap.ui.core.BusyIndicator.show(0);
        },

        setFree: function() {
            sap.ui.core.BusyIndicator.hide();
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

        setStatusInputImpostos: function() {
            let bc = this.getView().getBindingContext();
            if (!bc)
                return;
            let oItem = bc.getObject();
            let oViewModel = this.getView().getModel('view');
            let oViewData = oViewModel.getData();

            // O input de impostos sera habilitado em casso que o material
            // do item não esteja cadastrado.
            oViewData.impostos.enabled = (oItem.material.Type == 'N');
            oViewModel.refresh();
        },

        onSubitemPress: function(oEvent) {
            if (!this.popoverInfoAtual){
                this.popoverInfoAtual = sap.ui.xmlfragment("simplifique.telaneg.view.InfoAtualSubItem", this);
                this.getView().addDependent(this.popoverInfoAtual);
            }
            let oRow = oEvent.getParameters().listItem;
            let bc = oRow.getBindingContext();
            let sPathSubitem = bc.getPath();
            this.popoverInfoAtual.bindElement(sPathSubitem);
            // Abrimos o popover no final da fila.
            let aCells = oRow.getCells();
            let subitemPopoverSrc = aCells[aCells.length - 1];
            this.popoverInfoAtual.openBy(subitemPopoverSrc);
        },

        onFecharPopoverInfoAtualSubitem: function() {
            this.popoverInfoAtual.close();
        },

        onPressImpostos: function(oEvent) {
            let bc = oEvent.getSource().getBindingContext();
            this.getOwnerComponent().getImpostosPopover()
                .open(bc.getPath(), oEvent.getSource());
        },


    });
}, /* bExport= */ true);
