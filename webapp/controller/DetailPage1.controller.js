sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    'simplifique/telaneg/model/formatter',
    "sap/ui/core/routing/History",
    'simplifique/telaneg/controller/AddItemManager',
    'sap/ui/model/json/JSONModel',
], function(BaseController, MessageBox, Utilities, formatter, History, AddItemManager, JSONModel) {
    "use strict";

    return BaseController.extend("simplifique.telaneg.controller.DetailPage1", {

        formatter: formatter,

        handleRouteMatched: function(oEvent) {


            var oParams = {
                "expand": "tipoNegociacao"
                };

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

        temCertezaDeEliminar: function(attribute) {
            return new Promise(function(fnResolve) {
                sap.m.MessageBox.confirm("Tem certeza que deseja eliminar os itens selecionados?", {
                    title: "Eliminar Item de Negociação",
                    actions: ["Tenho Sim", "Melhor Não"],
                    onClose: function(sActionClicked) {
                        fnResolve(sActionClicked === "Tenho Sim");
                    }
                });
            });
        },

        eliminarItem: function(c){
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

        submitChanges: function() {
            let m = this.getView().getModel();
            return new Promise( (resolve, reject) => 
                m.submitChanges({
                    success: (...args) => { resolve(args) },
                    error: (...args) => { reject(args) },
                })
            );
        },

        eliminarItensSelecionados: function() {
            let v = this.getView();
            return v.byId('itemsTable').getSelectedContexts()
                .map( c => this.eliminarItem(c) );
        },

        _onTableDelete: function() {
            let v = this.getView();
            let m = v.getModel();

            this.temCertezaDeEliminar()
                .then( eliminar => {
                    if (!eliminar)
                        return false;
                    return Promise.all(this.eliminarItensSelecionados());
                    })
                .then( (result) => { if (result) v.byId('itemsTable').getBinding('items').refresh(); } )
                .catch( (...args) => console.error(args) )
        },

        createAddItemManager: function() {
            this.addItemManager = new AddItemManager(this);
        },

        selectAddItemProcess: function() {
            let oNegociacao = this.getView().getBindingContext().getObject();
            this.addItemProcess = this.addItemManager.selectAddItemProcess(oNegociacao.TipoNegociacao);
        },

        toogleAddItemPopover: function(oEvent) {
            // @todo Deveria ser chamado quando acontece a navegação.
            this.selectAddItemProcess();
            this.addItemProcess.toogleAddItemPopover(oEvent);
        },

        _onButtonPress: function(oEvent) {
            this.toogleAddItemPopover(oEvent);
            //sap.m.MessageToast.show("Serão adicionados itens na negociação.");
            return;
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
        
        onGravar: async function() {
            let v = this.getView();
            let m = v.getModel();
            /*
            let bc = v.getBindingContext();
            let p = bc.getPath();
            let o = bc.getObject();
            m.update(p,{Descricao: o.Descricao})
            */
            let result = await this.submitChanges();
            console.log(result);
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

        eliminarNegociacao: function() {
            let v = this.getView();
            let m = v.getModel();
            return new Promise( 
                (resolve, reject) => {
                    m.remove(v.getBindingContext().getPath(),{
                        success: (...args) => resolve(args),
                        error: (...args) => reject(args),
                        })
                }
            );
            
        },
        
        temCertezaDeEliminarNegociacao: function() {
            return new Promise(function(fnResolve) {
                sap.m.MessageBox.confirm("Tem certeza que deseja eliminar a negociação?", {
                    title: "Eliminar Negociação",
                    actions: ["Tenho Sim", "Melhor Não"],
                    onClose: function(sActionClicked) {
                        fnResolve(sActionClicked === "Tenho Sim");
                    }
                });
            })
        },

        onEliminarNegociacao: async function() {
            await this.temCertezaDeEliminarNegociacao();
            try {
                await this.eliminarNegociacao();
                this.oRouter.navTo('/MasterPage1');
            } catch (e) {
                console.error(e);
            }
        },

        onInit: function() {
            this.getView().setModel(new JSONModel({
                SelecaoLivre: {
                    itens: [],
                    },
                }), 'view');
            //this.createAddItemManager();
            //@todo Mudar para serviço OData
            let de = new Date();
            de.setDate((new Date()).getDate()-5);
            let ate = new Date();
            ate.setDate((new Date()).getDate()+25);
            let listasFornecedores = new sap.ui.model.json.JSONModel({
                GrupoListaSet: [
                    {
                        ID: 'L01',
                        Fornecedor: 'CARLA BEATRIZ ALMEIDA SANTOS',
                        Centro: 'BVBA',
                        GrupoCompra: 'Limpeza',
                        DataDe: de,
                        DataAte: ate,
                        produtos: [
                            {ID: 'P1', Nome: 'Produto 1'},
                            {ID: 'P1', Nome: 'Produto 1'},
                            {ID: 'P1', Nome: 'Produto 1'},
                        ]
                    },
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

        },

        /**
         * Gera a combinacao dos fornecedores, materiais e UFs selecionadas
         * e gera um array que servira como modelo para a lista de itens a
         * serem incluido no documento de negociacao.
         */
        onEnteringLastStep: function() {
            // Por cada um dos IDs das listas dentro do popover.
            let items = ['fornecedoresSearchAndSelect',
            'materiaisSearchAndSelect',
            'UFsSearchAndSelect',
            // Por cada id retornamos um array com os objetos selecionados.
            ].map( id => {
                    let list = this.getView().byId(id)
                    return list.getSelectedContexts()
                        .map( c => c.getObject() );
                    })
                // Com cada lista de objetos de cada lista a combinamos gerando
                // a lista de itens com os fornecedores, materiais e UFs
                // selecionadas.
                .reduce( (items, objects, index) => {
                   // o [].concat(...x) Ã© equivalente a x.flat(), sÃ³que ainda
                    // a funcao flat nao foi incorporada no Babel.
                    return [].concat(...items.map( i => objects.map( o => {
                        switch(index){
                            case 0:
                                return Object.assign({Fornecedor: o}, i);
                            case 1: 
                                return Object.assign({Material: o}, i);
                            case 2:
                                return Object.assign({UF: o}, i);
                            }
                        })));
                    //Importante: o reduce comeca com um array com um objeto vazio. 
                   }, [{}]);
            let m = this.getView().getModel('view');
            if (!m)
                return;
            m.setProperty('/SelecaoLivre/itens',items);
            this.getView().byId('SelecaoLivreItensTable').selectAll();
        },

        /**
         * Pega os itens que foram selecionados e tenta adicionar os mesmos
         * no documento de negociacao.
         */
        onFinish: function() {
            let v = this.getView();
            let m = v.getModel();
            let oNegociacao = v.getBindingContext().getObject();
            let sPathNegociacao = v.getBindingContext().getPath();
            v.byId('SelecaoLivreItensTable')
                .getSelectedContexts()
                .map( c => c.getObject() )
                .map( item => { return {
                    NegociacaoID: oNegociacao.ID,
                    FornecedorID: item.Fornecedor.ID,
                    // @todo Tirar hardcode de tipo cadastrado.
                    //FornecedorType: item.Fornecedor.ID,
                    FornecedorType: 'C',
                    MaterialID: item.Material.ID,
                    // @todo Tirar hardcode de tipo cadastrado.
                    //MaterialType: item.Material.Type,
                    MaterialType: 'C',
                    CentroID: item.UF.Centro,
                    }})
                .forEach( item =>
                    m.createEntry(
                        `${sPathNegociacao}/items/`, 
                        {
                            properties: item,
                            success: (...args) => console.log(args),
                            error: (...args) => console.error(args),
                        })
                    );
            m.submitChanges({
                success:  (...args) => {
                    console.log(args);
                    m.resetChanges();
                    v.byId('itemsTable').getBinding('items').refresh();
                    v.byId('popoverAddItem').close();
                    },
                error: (...args) => {
                    console.error(args);
                    m.resetChanges();
                    },
                });
        },
    });
}, /* bExport= */ true);
