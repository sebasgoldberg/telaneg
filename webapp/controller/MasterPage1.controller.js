import BaseController from 'sap/ui/core/mvc/Controller';
import MessageBox from 'sap/m/MessageBox';
import formatter from 'simplifique/telaneg/model/formatter';
import Fragment from 'sap/ui/core/Fragment';
import JSONModel from 'sap/ui/model/json/JSONModel';

export default class MasterPage1 extends BaseController{

        constructor(...args){
            super(...args);
            this.formatter = formatter;
            }

        handleRouteMatched(oEvent) {

            var oParams = {};
            var oView = this.getView();
            var bSelectFirstListItem = false;
            if (oEvent.mParameters.data.context || oEvent.mParameters.data.masterContext) {
                    this.sContext = oEvent.mParameters.data.context;
                    var oPath;
                    this.sMasterContext = oEvent.mParameters.data.masterContext;
                    if (this.sMasterContext) {
                        oPath = {
                            path: '/' + this.sMasterContext,
                            parameters: oParams
                        };
                        this.getView().bindObject(oPath);
                    } else if (this.sContext) {
                        var sCurrentContextPath = '/' + this.sContext;

                        bSelectFirstListItem = false;
                    }

                }
            if (bSelectFirstListItem) {
                    oView.addEventDelegate({
                        onBeforeShow: function() {
                            var oContent = this.getView().getContent();
                            if (oContent) {
                                if (!sap.ui.Device.system.phone) {
                                    var oList = oContent[0].getContent() ? oContent[0].getContent()[0] : undefined;
                                    if (oList) {
                                        var sContentName = oList.getMetadata().getName();
                                        if (sContentName.indexOf('List') > -1) {
                                            oList.attachEventOnce('updateFinished', function() {
                                                var oFirstListItem = this.getItems()[0];
                                                if (oFirstListItem) {
                                                    oList.setSelectedItem(oFirstListItem);
                                                    oList.fireItemPress({
                                                        listItem: oFirstListItem
                                                    });
                                                }
                                            }.bind(oList));
                                        }
                                    }
                                }
                            }
                        }.bind(this)
                    });
                }
           this.getView().byId("sap_List_Page_0-content-sap_m_List-1").getBinding('items').refresh();

        }

        _attachSelectListItemWithContextPath(sContextPath) {
            var oView = this.getView();
            var oContent = this.getView().getContent();
            if (oContent) {
                    if (!sap.ui.Device.system.phone) {
                        var oList = oContent[0].getContent() ? oContent[0].getContent()[0] : undefined;
                        if (oList && sContextPath) {
                            var sContentName = oList.getMetadata().getName();
                            var oItemToSelect, oItem, oContext, aItems, i;
                            if (sContentName.indexOf('List') > -1) {
                                if (oList.getItems().length) {
                                    oItemToSelect = null;
                                    aItems = oList.getItems();
                                    for (i = 0; i < aItems.length; i++) {
                                        oItem = aItems[i];
                                        oContext = oItem.getBindingContext();
                                        if (oContext && oContext.getPath() === sContextPath) {
                                            oItemToSelect = oItem;
                                        }
                                    }
                                    if (oItemToSelect) {
                                        oList.setSelectedItem(oItemToSelect);
                                    }
                                } else {
                                    oView.addEventDelegate({
                                        onBeforeShow: function() {
                                            oList.attachEventOnce('updateFinished', function() {
                                                oItemToSelect = null;
                                                aItems = oList.getItems();
                                                for (i = 0; i < aItems.length; i++) {
                                                    oItem = aItems[i];
                                                    oContext = oItem.getBindingContext();
                                                    if (oContext && oContext.getPath() === sContextPath) {
                                                        oItemToSelect = oItem;
                                                    }
                                                }
                                                if (oItemToSelect) {
                                                    oList.setSelectedItem(oItemToSelect);
                                                }
                                            });
                                        }
                                    });
                                }
                            }

                        }
                    }
                }

        }

        _onListItemPress(oEvent) {

            var oBindingContext = oEvent.getParameter('listItem').getBindingContext();

            return new Promise(function(fnResolve) {
                    this.doNavigate('DetailPage1', oBindingContext, fnResolve, '');
                }.bind(this)).catch(function(err) {
                    if (err !== undefined) {
                        MessageBox.error(err.message);
                    }
                });

        }

        doNavigate(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {

            var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
            var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

            var sEntityNameSet;
            if (sPath !== null && sPath !== '') {
                    if (sPath.substring(0, 1) === '/') {
                        sPath = sPath.substring(1);
                    }
                    sEntityNameSet = sPath.split('(')[0];
                }
            var sNavigationPropertyName;
            var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

            if (sEntityNameSet !== null) {
                    sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
                }
            if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
                    if (sNavigationPropertyName === '') {
                        this.oRouter.navTo(sRouteName, {
                            context: sPath,
                            masterContext: sMasterContext
                        }, false);
                    } else {
                        oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
                            if (bindingContext) {
                                sPath = bindingContext.getPath();
                                if (sPath.substring(0, 1) === '/') {
                                    sPath = sPath.substring(1);
                                }
                            } else {
                                sPath = 'undefined';
                            }

                        // If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
                            if (sPath === 'undefined') {
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

            if (typeof fnPromiseResolve === 'function') {
                    fnPromiseResolve();
                }
        }

        _getList() {
            var sControlId = 'sap_List_Page_0-content-sap_m_List-1';
            return this.getView().byId(sControlId);
        }

        _onSearchFieldSearch(oEvent) {
            var sControlId = 'sap_List_Page_0-content-sap_m_List-1';
            var oControl = this.getView().byId(sControlId);

            // Get the search query, regardless of the triggered event ('query' for the search event, 'newValue' for the liveChange one).
            var sQuery = oEvent.getParameter('query') || oEvent.getParameter('newValue');
            var sSourceId = oEvent.getSource().getId();

            return new Promise(function(fnResolve) {
                    var aFinalFilters = [];

                    var aFilters = [];
                // 1) Search filters (with OR)
                    if (sQuery && sQuery.length > 0) {

                        if (parseInt(sQuery))
                            aFilters.push(new sap.ui.model.Filter('ID', sap.ui.model.FilterOperator.EQ, sQuery))
                        else
                            aFilters.push(new sap.ui.model.Filter('Descricao', sap.ui.model.FilterOperator.Contains, sQuery));

                    }

                    var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, false)] : [];
                    var oBindingOptions = this.updateBindingOptions(sControlId, {
                        filters: aFinalFilters
                    }, sSourceId);
                    var oBindingInfo = oControl.getBindingInfo('items');
                    oControl.bindAggregation('items', {
                        model: oBindingInfo.model,
                        path: oBindingInfo.path,
                        parameters: oBindingInfo.parameters,
                        template: oBindingInfo.template,
                        templateShareable: true,
                        //sorter: oBindingOptions.sorters,
                        sorter: [
                            new sap.ui.model.Sorter("Data", true),
                            new sap.ui.model.Sorter("ID", true),
                            ],
                        filters: oBindingOptions.filters
                    });
                }.bind(this)).catch(function(err) {
                    if (err !== undefined) {
                        MessageBox.error(err.message);
                    }
                });

        }

        updateBindingOptions(sCollectionId, oBindingData, sSourceId) {
            this.mBindingOptions = this.mBindingOptions || {};
            this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

            var aSorters = this.mBindingOptions[sCollectionId].sorters;
            var oGroupby = this.mBindingOptions[sCollectionId].groupby;

            // If there is no oBindingData parameter, we just need the processed filters and sorters from this function
            if (oBindingData) {
                    if (oBindingData.sorters) {
                        aSorters = oBindingData.sorters;
                    }
                    if (oBindingData.groupby) {
                        oGroupby = oBindingData.groupby;
                    }
                // 1) Update the filters map for the given collection and source
                    this.mBindingOptions[sCollectionId].sorters = aSorters;
                    this.mBindingOptions[sCollectionId].groupby = oGroupby;
                    this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
                    this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
                }

            // 2) Reapply all the filters and sorters
            var aFilters = [];
            for (var key in this.mBindingOptions[sCollectionId].filters) {
                    aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
                }

            // Add the groupby first in the sorters array
            if (oGroupby) {
                    aSorters = aSorters ? [oGroupby].concat(aSorters) : [oGroupby];
                }

            var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
            return {
                    filters: aFinalFilters,
                    sorters: aSorters
                };

        }

        _onObjectListItemPress(oEvent) {

            var oBindingContext = oEvent.getSource().getBindingContext();

            return new Promise(function(fnResolve) {

                    this.doNavigate('DetailPage1', oBindingContext, fnResolve, '');
                }.bind(this)).catch(function(err) {
                    if (err !== undefined) {
                        MessageBox.error(err.message);
                    }
                });

        }

        getListCanais(){
            return Fragment.byId('addNegociacaoPopover','canaisList');
        }

        onCreateNegociacao(oEvent) {
            if (!oEvent)
                return;
            if (!this.popover) {
                this.popover = sap.ui.xmlfragment(
                    "addNegociacaoPopover",
                    "simplifique.telaneg.view.AddNegociacaoPopover",
                    this);
                this.getView().addDependent(this.popover);
            }
            if (this.popover.isOpen())
                this.popover.close()
            else{
                this.getNavContainerCriarNegociacao().backToTop();
                this.getListCanais().removeSelections(true);
                this.getListCanais().fireSelectionChange();
                this.popover.openBy(oEvent.getSource());
            }
        }

        getNavContainerCriarNegociacao(){
            return Fragment.byId('addNegociacaoPopover','navContainerCriarNegociacao');
        }

        onCancelCriarNegociacao(attribute) {
            this.popover.close();
        }

        onTipoNegociacaoPressed(oEvent) {
            let oSourceControl = oEvent.getSource();
            let oBC = oSourceControl.getBindingContext();
            this.oTipoNegociacao = oBC.getObject();
            this.getNavContainerCriarNegociacao().to(
                Fragment.byId('addNegociacaoPopover','bandeirasPage'));
        }

        onBandeiraPressed(oEvent) {
            let oSourceControl = oEvent.getSource();
            let oBC = oSourceControl.getBindingContext();
            this.oBandeira = oBC.getObject();
            this.getNavContainerCriarNegociacao().to(
                Fragment.byId('addNegociacaoPopover','canaisPage'));
        }

        onSelectionChangeCanais(oEvent){
            let v = this.getView();
            let oViewModel = v.getModel('view');
            let oDataViewModel = oViewModel.getData();
            let oList = oEvent.getSource();
            oDataViewModel.criacao.isCriacaoPossivel = (oList.getSelectedContexts().length > 0);
            oViewModel.refresh();
        }

        createNegociacao(){
            return new Promise( (resolve, reject) => {
                let m = this.getView().getModel();
                let canais = this.getListCanais().getSelectedContexts()
                    .map( c => c.getObject() );
                m.create('/NegociacaoSet',
                    {
                        TipoNegociacao: this.oTipoNegociacao.ID,
                        Bandeira: this.oBandeira.ID,
                        canais: canais,
                        },
                    {
                        success: (...args) => resolve(args),
                        error: (...args) => reject(args),
                        }
                    );
            });
        }

        setBusy() {
            sap.ui.core.BusyIndicator.show(0);
        }

        setFree() {
            sap.ui.core.BusyIndicator.hide();
        }

        async onCriarDocumentoNegociacao(oEvent) {

            /*
            let oSourceControl = oEvent.getSource();
            let oBC = oSourceControl.getBindingContext();
            let oBandeira = oBC.getObject();

            let m = this.getView().getModel();
            let that = this;
            let oContext = m.createEntry("/NegociacaoSet", {
                properties: {
                    TipoNegociacao: this.oTipoNegociacao.ID,
                    Bandeira: oBandeira.ID,
                    },
                success: (...args) => {
                    console.log(args);
                    },
                });
            */

            try {
                this.setBusy();
                let result = await this.createNegociacao();
                this.getView().byId('sap_List_Page_0-content-sap_m_List-1')
                    .getBinding('items').refresh();
                this.popover.close();
                //this.doNavigate('DetailPage1', oContext);
                this.oRouter.navTo('DetailPage1', {
                    context: `NegociacaoSet('${result[0].ID}')`,
                }, false);

            } catch (e) {
                console.error(e);
            } finally{
                this.setFree();
            }
        }

        onInit() {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget('MasterPage1').attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            this.getView().setModel(new JSONModel({
                criacao: {
                    isCriacaoPossivel: false,
                },
            }), 'view');
        }

        onAfterRendering() {
            let oControl = this._getList();
            let oItemsBinding = oControl.getBinding('items');
            oItemsBinding.sort([
                new sap.ui.model.Sorter("Data", true),
                new sap.ui.model.Sorter("ID", true),
            ]);
        }
}

// for ui5 compatibility which relies on globals
// jQuery.sap.setObject('simplifique.telaneg.controller.MasterPage1', MasterPage1);
