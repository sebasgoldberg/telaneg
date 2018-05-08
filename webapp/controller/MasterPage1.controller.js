sap.ui.define(['sap/ui/core/mvc/Controller',
    'sap/m/MessageBox',
    './utilities',
    'simplifique/telaneg/model/formatter',
    'sap/ui/core/routing/History'
], function(BaseController, MessageBox, Utilities, formatter, History) {
    'use strict';

    return BaseController.extend('simplifique.telaneg.controller.MasterPage1', {

        formatter: formatter,

        handleRouteMatched: function(oEvent) {

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

        },
        _attachSelectListItemWithContextPath: function(sContextPath) {
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

        },
        _onListItemPress: function(oEvent) {

            var oBindingContext = oEvent.getParameter('listItem').getBindingContext();

            return new Promise(function(fnResolve) {
                    this.doNavigate('DetailPage1', oBindingContext, fnResolve, '');
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
        },
        _onSearchFieldSearch: function(oEvent) {
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

                        aFilters.push(new sap.ui.model.Filter('ID', sap.ui.model.FilterOperator.Contains, sQuery));

                        aFilters.push(new sap.ui.model.Filter('Descricao', sap.ui.model.FilterOperator.Contains, sQuery));

                        aFilters.push(new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.Contains, sQuery));

                        var iQuery = parseFloat(sQuery);
                        if (!isNaN(iQuery)) {
                            aFilters.push(new sap.ui.model.Filter('ValorTotalPedido', sap.ui.model.FilterOperator.EQ, sQuery));
                        }

                        var iQuery = parseFloat(sQuery);
                        if (!isNaN(iQuery)) {
                            aFilters.push(new sap.ui.model.Filter('NovaMargem2', sap.ui.model.FilterOperator.EQ, sQuery));
                        }

                        var iQuery = parseFloat(sQuery);
                        if (!isNaN(iQuery)) {
                            aFilters.push(new sap.ui.model.Filter('NovoIC', sap.ui.model.FilterOperator.EQ, sQuery));
                        }

                        var iQuery = parseFloat(sQuery);
                        if (!isNaN(iQuery)) {
                            aFilters.push(new sap.ui.model.Filter('Fornecedores', sap.ui.model.FilterOperator.EQ, sQuery));
                        }

                        var iQuery = parseFloat(sQuery);
                        if (!isNaN(iQuery)) {
                            aFilters.push(new sap.ui.model.Filter('Produtos', sap.ui.model.FilterOperator.EQ, sQuery));
                        }

                        var iQuery = parseFloat(sQuery);
                        if (!isNaN(iQuery)) {
                            aFilters.push(new sap.ui.model.Filter('UFs', sap.ui.model.FilterOperator.EQ, sQuery));
                        }

                        aFilters.push(new sap.ui.model.Filter('StatusValorTotalPedido', sap.ui.model.FilterOperator.Contains, sQuery));

                        aFilters.push(new sap.ui.model.Filter('StatusNovaMargem2', sap.ui.model.FilterOperator.Contains, sQuery));

                        aFilters.push(new sap.ui.model.Filter('StatusNovoIC', sap.ui.model.FilterOperator.Contains, sQuery));

                        var iQuery = parseFloat(sQuery);
                        if (!isNaN(iQuery)) {
                            aFilters.push(new sap.ui.model.Filter('MargemTeorica', sap.ui.model.FilterOperator.EQ, sQuery));
                        }

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
                        sorter: oBindingOptions.sorters,
                        filters: oBindingOptions.filters
                    });
                }.bind(this)).catch(function(err) {
                    if (err !== undefined) {
                        MessageBox.error(err.message);
                    }
                });

        },
        updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
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

        },
        _onObjectListItemPress: function(oEvent) {

            var oBindingContext = oEvent.getSource().getBindingContext();

            return new Promise(function(fnResolve) {

                    this.doNavigate('DetailPage1', oBindingContext, fnResolve, '');
                }.bind(this)).catch(function(err) {
                    if (err !== undefined) {
                        MessageBox.error(err.message);
                    }
                });

        },
        _onButtonPress: function() {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.navTo('NovaNegociacao');
            return;
            return new Promise(function(fnResolve) {
                    var sTargetPos = '';
                    sTargetPos = (sTargetPos === 'default') ? undefined : sTargetPos;
                    sap.m.MessageToast.show('Será criada uma nova negociação.', {
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
        onInit: function() {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget('MasterPage1').attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

        }
    });
}, /* bExport= */ true);
