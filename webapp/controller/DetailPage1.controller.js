sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    'simplifique/telaneg/model/formatter',
    "sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, formatter, History) {
    "use strict";

    return BaseController.extend("simplifique.telaneg.controller.DetailPage1", {

        formatter: formatter,

        handleRouteMatched: function(oEvent) {

            var oParams = {};

            if (oEvent.mParameters.data.context) {
                this.sContext = oEvent.mParameters.data.context;
                var oPath;
                if (this.sContext) {
                    oPath = {
                        path: "/" + this.sContext,
                        parameters: oParams
                    };
                    this.getView().bindObject(oPath);
                }
            }

        },
        _onTableItemPress: function(oEvent) {

            var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

            return new Promise(function(fnResolve) {
                this.doNavigate("DetailPage2", oBindingContext, fnResolve, "");
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
        _onTableDelete: function() {
            return new Promise(function(fnResolve) {
                sap.m.MessageBox.confirm("Tem certeza que deseja eliminar os itens selecionados?", {
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
        displayAddItemPopover: function(oEvent) {
            if (!oEvent)
                return;
            if (!this.popover) {
                this.popover = sap.ui.xmlfragment(
                    "addItemPopover",
                    "simplifique.telaneg.view.AddItemNegociacaoPopover",
                    this);
            }
            this.getView().addDependent(this.popover);
            this.popover.openBy(oEvent.getSource());
        },
        onFornecedorSearch:function(){
        },
        onFornecedorSelected: function(oEvent) {
            let oCtx = oEvent.getSource().getBindingContext('listas');
            let oNavCon = sap.ui.core.Fragment.byId("addItemPopover", "navCon");
            let oDetailPage = sap.ui.core.Fragment.byId("addItemPopover", "gruposListasFornecedor");
            oDetailPage.bindElement({ path: oCtx.getPath(), model: 'listas'});
            oNavCon.to(oDetailPage);
        },
        onGrupoListaSelected: function(oEvent) {
            let oCtx = oEvent.getSource().getBindingContext('listas');
            let oNavCon = sap.ui.core.Fragment.byId("addItemPopover", "navCon");
            let oDetailPage = sap.ui.core.Fragment.byId("addItemPopover", "produtos");
            oDetailPage.bindElement({ path: oCtx.getPath(), model: 'listas'});
            oNavCon.to(oDetailPage);
        },

        onAddGruposListas: function(oEvent) {
            let v = this.getView();
            let sNegociacaoPath = v.getBindingContext().getPath();
            let oNegociacao = v.getBindingContext().getObject();

            let m = v.getModel();

            let oPageGruposListasFornecedor = sap.ui.core.Fragment.byId("addItemPopover", "gruposListasFornecedor");
            let oContextFornecedor = oPageGruposListasFornecedor.getBindingContext('listas')
            let oFornecedor = oContextFornecedor.getObject();

            let oListGruposListas = sap.ui.core.Fragment.byId("addItemPopover", "listGruposListasFornecedor");

            // @todo Codigo sync, deveria ser adaptado para ser async.
            oListGruposListas.getSelectedContexts().forEach( oContextGrupoLista => {

                let oGrupoLista = oContextGrupoLista.getObject();
                oGrupoLista.produtos.forEach( produto => {

                    let oContextItem = m.createEntry(
                        //sNegociacaoPath+"/ItemNegociacaoSet", { });
                        "/ItemNegociacaoSet", { properties: {
                            "NegociacaoID": oNegociacao.ID,
                            } });
                    });
                });
            m.submitChanges();
            v.byId('itemsTable').getBinding('items').refresh();
            this.popover.close();
        },
        onCancelAddGruposListas: function(oEvent) {
            this.popover.close();
        },
        onNavBack: function() {
            let oNavCon = sap.ui.core.Fragment.byId("addItemPopover", "navCon");
            oNavCon.back();
        },
        _onButtonPress: function(oEvent) {
            this.displayAddItemPopover(oEvent);
            //sap.m.MessageToast.show("Serão adicionados itens na negociação.");
            return;

            var sDialogName = "Dialog1";
            this.mDialogs = this.mDialogs || {};
            var oDialog = this.mDialogs[sDialogName];
            var oSource = oEvent.getSource();
            var oBindingContext = oSource.getBindingContext();
            var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
            var oView;
            if (!oDialog) {
                this.getOwnerComponent().runAsOwner(function() {
                    oView = sap.ui.xmlview({
                        viewName: "simplifique.telaneg.view." + sDialogName
                    });
                    this.getView().addDependent(oView);
                    oView.getController().setRouter(this.oRouter);
                    oDialog = oView.getContent()[0];
                    this.mDialogs[sDialogName] = oDialog;
                }.bind(this));
            }

            return new Promise(function(fnResolve) {
                oDialog.attachEventOnce("afterOpen", null, fnResolve);
                oDialog.open();
                if (oView) {
                    oDialog.attachAfterOpen(function() {
                        oDialog.rerender();
                    });
                } else {
                    oView = oDialog.getParent();
                }

                var oModel = this.getView().getModel();
                if (oModel) {
                    oView.setModel(oModel);
                }
                if (sPath) {
                    var oParams = oView.getController().getBindingParameters();
                    oView.bindObject({
                        path: sPath,
                        parameters: oParams
                    });
                }
            }.bind(this)).catch(function(err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },
        _onAccept: function(attribute) {
            sap.m.MessageToast.show("Os itens selecionados foram aprovados.");
        },
        _onReject: function(attribute) {
            sap.m.MessageToast.show("Os itens selecionados foram rejeitados.");
        },
        _onButtonPress1: function() {
            return new Promise(function(fnResolve) {
                var sTargetPos = "";
                sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
                sap.m.MessageToast.show("Todos os itens serão finalizados e a negociação passara a estar finalizada (operações possíveis: enviar os preços de compra modificados para o portal, gerar os preços de compra no SAP, etc.).", {
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
        _onButtonPress2: function() {
            let m = this.getView().getModel();
            m.submitChanges();
            return new Promise(function(fnResolve) {
                var sTargetPos = "";
                sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
                sap.m.MessageToast.show("São gravadas as informações de cabeçalho da negociação", {
                    onClose: fnResolve,
                    duration: 2000 || 3000,
                    at: sTargetPos,
                    my: sTargetPos
                });
            }).catch(function(err) {
                if (err !== undefined) {
                    MessageBox.error(err.message);
                }
            });

        },
        _onButtonPress3: function() {
            return new Promise(function(fnResolve) {
                sap.m.MessageBox.confirm("Tem certeza que deseja eliminar a negociação?", {
                    title: "Eliminar Negociação",
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
            //@todo Mudar para serviço OData
            let de = new Date();
            de.setDate((new Date()).getDate()-5);
            let ate = new Date();
            ate.setDate((new Date()).getDate()+25);
            let listasFornecedores = new sap.ui.model.json.JSONModel({
                Fornecedor: [
                    {
                        Nome: 'CARLA BEATRIZ ALMEIDA SANTOS',
                        ID: 'F01',
                        gruposListas:[
                            {
                                Centro: 'BVBA',
                                GrupoCompra: '14',
                                DataDe: de,
                                DataAte: ate,
                                produtos: [
                                    {ID: 'P1', Nome: 'Produto 1'},
                                    {ID: 'P1', Nome: 'Produto 1'},
                                    {ID: 'P1', Nome: 'Produto 1'},
                                ]
                                }
                        ]},
                ]
                });
            this.getView().setModel(listasFornecedores, 'listas');
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("DetailPage1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

            var oView = this.getView();
            oView.addEventDelegate({
                onBeforeShow: function() {
                    if (sap.ui.Device.system.phone) {
                        var oPage = oView.getContent()[0];
                        if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
                            oPage.setShowNavButton(true);
                            oPage.attachNavButtonPress(function() {
                                this.oRouter.navTo("MasterPage1", {}, true);
                            }.bind(this));
                        }
                    }
                }.bind(this)
            });

        }
    });
}, /* bExport= */ true);
