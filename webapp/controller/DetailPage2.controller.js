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

        handleRouteMatched: function(oEvent) {

            var oParams = {
                //"expand": "material,fornecedor,centro,simulacao,impostosEntrada,impostosSaida,informacao,contrato,stock,nossoPricing,vendaActual,vendaAnterior,categoryReview"
                "expand": "material,fornecedor,simulacao,impostosEntrada,impostosSaida,informacao"
            };

            if (oEvent.mParameters.data.context) {
                this.sContext = oEvent.mParameters.data.context;
                var oPath;
                if (this.sContext) {
                    oPath = {
                        path: "/" + this.sContext,
                        parameters: oParams,
                        events: {
                            dataReceived: () => this.setStatusInputImpostos(),
                            },
                    };
                    this.getView().bindObject(oPath);
                    this._realizarSimulacao();
                }
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
        _onButtonPress2: function() {
            return new Promise(function(fnResolve) {
                var sTargetPos = "";
                sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
                sap.m.MessageToast.show("São gravadas as informações de simulação do item.", {
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

        _realizarSimulacao: function() {

            let bc = this.getView().getBindingContext();
            if (!bc)
                return;

            let model = this.getView().getModel()

            let simulacao = model.getData(bc.getPath()+'/simulacao');
            let impostosEntrada = model.getData(bc.getPath()+'/impostosEntrada');
            let impostosSaida = model.getData(bc.getPath()+'/impostosSaida');
            let nossoPricing = model.getData(bc.getPath()+'/nossoPricing');

            let f = parseFloat;
            
            // Custo = Preço de Compra * (1 - PIS - COFINS - ICMS + IPI + ST - Desconto) 
            try {
                simulacao.Custo = f(simulacao.PrecoCompra) * ( 100 -
                f(impostosEntrada.PIS) - f(impostosEntrada.COFINS) -
                f(impostosEntrada.ICMS) + f(impostosEntrada.IPI) +
                f(impostosEntrada.ST) - f(simulacao.Desconto) ) / 100;

            } catch (e) {
                simulacao.Custo = 0;
            }           
            model.setProperty(bc.getPath()+'/simulacao/Custo',simulacao.Custo);

            // PMZ Novo = Custo * ( 1 + impostos saida)
            try {
                simulacao.PMZNovo = f(simulacao.Custo) * (100 +
                    f(impostosSaida.ICMS) + f(impostosSaida.PIS) +
                    f(impostosSaida.COFINS) ) / 100;
            } catch (e) {
                simulacao.PMZNovo = 0;
            }
            model.setProperty(bc.getPath()+'/simulacao/PMZNovo',simulacao.PMZNovo);
            
            // PMZ Médio = media_lojas(PMM) (só informada a quan. compra)
            simulacao.PMZMedio = simulacao.PMZNovo;
            model.setProperty(bc.getPath()+'/simulacao/PMZMedio',simulacao.PMZMedio);

            // Margem 1 = ( Preço de Venda - PMZ Novo ) / Preço de Venda
            try {
                simulacao.Margem1 = ( f(simulacao.PrecoVenda) - f(simulacao.PMZNovo)
                    ) * 100 / f(simulacao.PrecoVenda);
            } catch (e) {
                simulacao.Margem1 = 0;
            }
            model.setProperty(bc.getPath()+'/simulacao/Margem1',simulacao.Margem1);

            // Margem 2 = Margem 1 + (Recomposição / Volumem)
            try {
                simulacao.Margem2 = f(simulacao.Margem1) + (
                    100 * ( f(simulacao.Recomposicao) - f(simulacao.DespesasAcessorias) ) /
                    f(simulacao.Volumem) / f(simulacao.PrecoVenda) );
            } catch (e) {
                simulacao.Margem2 = 0;
            }
            model.setProperty(bc.getPath()+'/simulacao/Margem2',simulacao.Margem2);

            // Valor Total Pedido = Preço de Compra * (1 + IPI + ST - Desconto) * Volumem
            simulacao.ValorTotalPedido = f(simulacao.PrecoCompra) * (
                100 + f(impostosEntrada.IPI) + f(impostosEntrada.ST) -
                f(simulacao.Desconto) ) * f(simulacao.Volumem) / 100;
            model.setProperty(bc.getPath()+'/simulacao/ValorTotalPedido',simulacao.ValorTotalPedido);

            // Previsão de Venda = Preço de Venda * Previsão de Venda[UN]
            simulacao.PrevisaoVendaDinheiro = f(simulacao.PrecoVenda) * f(simulacao.PrevisaoVenda);
            model.setProperty(bc.getPath()+'/simulacao/PrevisaoVendaDinheiro',simulacao.PrevisaoVendaDinheiro);

            // IC = (Preço de Venda - Preço Mercado) / Preço Mercado
            try {
                simulacao.IC = ( f(simulacao.PrecoVenda) - f(nossoPricing.PrecoMercado) ) *
                100 / f(nossoPricing.PrecoMercado);
            } catch (e) {
                simulacao.IC = 0;
            }
            model.setProperty(bc.getPath()+'/simulacao/IC',simulacao.IC);

        },

        realizarSimulacao: function(oEvent) {
            this._realizarSimulacao();
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

    });
}, /* bExport= */ true);
