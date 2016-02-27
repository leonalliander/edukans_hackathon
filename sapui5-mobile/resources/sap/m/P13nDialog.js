/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Dialog','./IconTabBar','./IconTabFilter','./P13nDialogRenderer','./library','sap/ui/core/EnabledPropagator','jquery.sap.xml','sap/m/ButtonType'],function(q,D,I,a,P,l,E,B){"use strict";var b=D.extend("sap.m.P13nDialog",{metadata:{library:"sap.m",properties:{initialVisiblePanelType:{type:"string",group:"Misc",defaultValue:null},showReset:{type:"boolean",group:"Appearance",defaultValue:false},validationExecutor:{type:"object",group:"Misc",defaultValue:null}},aggregations:{panels:{type:"sap.m.P13nPanel",multiple:true,singularName:"panel",bindable:"bindable"}},events:{ok:{},cancel:{},reset:{}}}});E.apply(b.prototype,[true]);b.prototype.init=function(e){this.addStyleClass("sapMP13nDialog");D.prototype.init.apply(this,arguments);this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oResetButton=null;this._mValidationListener={};this._createDialog();};b.prototype.setShowReset=function(s){if(this.getButtons()&&this.getButtons()[2]){this.getButtons()[2].setVisible(s);}};b.prototype.addPanel=function(p){this.addAggregation("panels",p);var n=this._mapPanelToNavigationItem(p);p.data(P.CSS_CLASS+"NavigationItem",n);var N=this._getNavigationControl();if(N){sap.ui.Device.system.phone?N.addItem(n):N.addButton(n);}this._setVisibilityOfPanel(p);this._setDialogTitleFor(p);return this;};b.prototype.insertPanel=function(p,i){this.insertAggregation("panels",p,i);var n=this._mapPanelToNavigationItem(p);p.data(P.CSS_CLASS+"NavigationItem",n);var N=this._getNavigationControl();if(N){sap.ui.Device.system.phone?N.insertItem(n):N.insertButton(n);}this._setVisibilityOfPanel(p);this._setDialogTitleFor(p);return this;};b.prototype.removePanel=function(p){p=this.removeAggregation("panels",p);var n=this._getNavigationControl();if(n){sap.ui.Device.system.phone?n.removeItem(p&&this._getNavigationItemByPanel(p)):n.removeButton(p&&this._getNavigationItemByPanel(p));}return p;};b.prototype.removeAllPanels=function(){var p=this.removeAllAggregation("panels");var n=this._getNavigationControl();if(n){sap.ui.Device.system.phone?n.removeAllItems():n.removeAllButtons();}return p;};b.prototype.destroyPanels=function(){this.destroyAggregation("panels");var n=this._getNavigationControl();if(n){sap.ui.Device.system.phone?n.destroyItems():n.destroyButtons();}return this;};b.prototype._createDialog=function(){if(sap.ui.Device.system.phone){var t=this;this.setVerticalScrolling(false);this.setHorizontalScrolling(false);this.setCustomHeader(new sap.m.Bar({contentLeft:new sap.m.Button({visible:false,type:B.Back,press:function(e){t._backToList();}}),contentMiddle:new sap.m.Title({text:this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS"),level:"H1"})}));this.setBeginButton(this._createOKButton());this.setEndButton(this._createCancelButton());}else{this.setHorizontalScrolling(false);this.setContentWidth("65rem");this.setContentHeight("40rem");this.setDraggable(true);this.setTitle(this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS"));this.addButton(this._createOKButton());this.addButton(this._createCancelButton());this.addButton(this._createResetButton());}};b.prototype._getNavigationControl=function(){if(this.getPanels().length<2){return null;}var t=this;if(sap.ui.Device.system.phone){if(!this.getContent().length){this.addContent(new sap.m.List({mode:sap.m.ListMode.None,itemPress:function(e){if(e){t._switchPanel(e.getParameter("listItem"));}}}));this.getContent()[0].addItem(this._getNavigationItemByPanel(this.getPanels()[0]));}return this.getContent()[0];}else{if(!this.getSubHeader()||!this.getSubHeader().getContentLeft().length){this.setSubHeader(new sap.m.Bar({contentLeft:[new sap.m.SegmentedButton({select:function(e){t._switchPanel(e.getParameter("button"));},width:'100%'})]}));this.getSubHeader().getContentLeft()[0].addButton(this._getNavigationItemByPanel(this.getPanels()[0]));}return this.getSubHeader().getContentLeft()[0];}};b.prototype.showValidationDialog=function(c,f,v){var m="";f.forEach(function(p){switch(p){case sap.m.P13nPanelType.filter:m="• "+sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_MESSAGE")+"\n"+m;break;case sap.m.P13nPanelType.columns:m="• "+sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VISIBLE_ITEMS_THRESHOLD_MESSAGE")+"\n"+m;break;}});for(var t in v){var M=v[t];m="• "+M.messageText+"\n"+m;}q.sap.require("sap.m.MessageBox");sap.m.MessageBox.show(m,{icon:sap.m.MessageBox.Icon.WARNING,title:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("P13NDIALOG_VALIDATION_TITLE"),actions:[sap.m.MessageBox.Action.OK,sap.m.MessageBox.Action.CANCEL],onClose:function(A){if(A===sap.m.MessageBox.Action.OK){c();}},styleClass:!!this.$().closest(".sapUiSizeCompact").length?"sapUiSizeCompact":""});};b.prototype._mapPanelToNavigationItem=function(p){if(!p){return null;}var n=null;if(sap.ui.Device.system.phone){n=new sap.m.StandardListItem({type:sap.m.ListType.Navigation,title:p.getBindingPath("title")?"{"+p.getBindingPath("title")+"}":p.getTitle()});}else{n=new sap.m.Button({type:B.Default,text:p.getBindingPath("title")?"{"+p.getBindingPath("title")+"}":p.getTitle()});}p.setValidationExecutor(q.proxy(this._callValidationExecutor,this));p.setValidationListener(q.proxy(this._registerValidationListener,this));n.setModel(p.getModel());return n;};b.prototype._switchPanel=function(n){var p=this._getPanelByNavigationItem(n);if(sap.ui.Device.system.phone){var N=this._getNavigationControl();if(N){N.setVisible(false);p.beforeNavigationTo();p.setVisible(true);this.getCustomHeader().getContentMiddle()[0].setText(p.getTitle());this.getCustomHeader().getContentLeft()[0].setVisible(true);}}else{this.setVerticalScrolling(p.getVerticalScrolling());this.getPanels().forEach(function(o){if(o===p){o.beforeNavigationTo();o.setVisible(true);}else{o.setVisible(false);}},this);}this.invalidate();this.rerender();};b.prototype._backToList=function(){var n=this._getNavigationControl();if(n){n.setVisible(true);var p=this.getVisiblePanel();p.setVisible(false);this._setDialogTitleFor(p);this.getCustomHeader().getContentLeft()[0].setVisible(false);}};b.prototype.getVisiblePanel=function(){var p=null;this.getPanels().some(function(o){if(o.getVisible()){p=o;return true;}});return p;};b.prototype._getPanelByNavigationItem=function(n){for(var i=0,p=this.getPanels(),c=p.length;i<c;i++){if(p[i].data(P.CSS_CLASS+"NavigationItem")===n){return p[i];}}return null;};b.prototype._getNavigationItemByPanel=function(p){if(!p){return null;}return p.data(P.CSS_CLASS+"NavigationItem");};b.prototype._setVisibilityOfOtherPanels=function(p,v){for(var i=0,c=this.getPanels(),d=c.length;i<d;i++){if(c[i]===p){continue;}c[i].setVisible(v);}};b.prototype._setVisibilityOfPanel=function(p){var v;if(sap.ui.Device.system.phone){v=this.getPanels().length===1;if(v){p.beforeNavigationTo();if(!this.getModel()){this.setModel(p.getModel());}}p.setVisible(v);this._setVisibilityOfOtherPanels(p,false);}else{v=this.getInitialVisiblePanelType()===p.getType()||this.getPanels().length===1;if(v){p.beforeNavigationTo();if(!this.getModel()){this.setModel(p.getModel());}}p.setVisible(v);if(v){this._setVisibilityOfOtherPanels(p,false);this.setVerticalScrolling(p.getVerticalScrolling());var o=this._getNavigationItemByPanel(p);var n=this._getNavigationControl();if(n){n.setSelectedButton(o);}}}};b.prototype.onAfterRendering=function(){D.prototype.onAfterRendering.apply(this,arguments);var c=q(this.getFocusDomRef()).find(".sapMDialogScrollCont");var i=this._getVisiblePanelID();if(i&&c){var p=q.find("#"+i);q(p).appendTo(q(c));}};b.prototype._getVisiblePanelID=function(){var p=this.getVisiblePanel();if(p){return this.getId()+"-panel_"+p.getId();}return null;};b.prototype._setDialogTitleFor=function(p){var t;if(this.getPanels().length>1){t=this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS");}else{switch(p.getType()){case sap.m.P13nPanelType.filter:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_FILTER");break;case sap.m.P13nPanelType.sort:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_SORT");break;case sap.m.P13nPanelType.group:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_GROUP");break;case sap.m.P13nPanelType.columns:t=this._oResourceBundle.getText("P13NDIALOG_TITLE_COLUMNS");break;default:t=p.getTitleLarge()||this._oResourceBundle.getText("P13NDIALOG_VIEW_SETTINGS");}}if(sap.ui.Device.system.phone){this.getCustomHeader().getContentMiddle()[0].setText(t);}else{this.setTitle(t);}};b.prototype._registerValidationListener=function(p,c){if(this.getPanels().indexOf(p)&&c&&this._mValidationListener[p.getType()]===undefined){this._mValidationListener[p.getType()]=c;}};b.prototype._callValidationExecutor=function(){var v=this.getValidationExecutor();if(v&&!q.isEmptyObject(this._mValidationListener)){var r=v(this._getPayloadOfPanels());var R=this._distributeValidationResult(r);for(var t in this._mValidationListener){var c=this._mValidationListener[t];c(R[t]||[]);}}};b.prototype._distributeValidationResult=function(r){var d={};r.forEach(function(R){R.panelTypes.forEach(function(t){if(d[t]===undefined){d[t]=[];}d[t].push({columnKey:R.columnKey,messageType:R.messageType,messageText:R.messageText});});});return d;};b.prototype._createOKButton=function(){var t=this;return new sap.m.Button({text:this._oResourceBundle.getText("P13NDIALOG_OK"),press:function(){var p=t._getPayloadOfPanels();var f=function(){t.fireOk({payload:p});};var c=function(){t.getPanels().forEach(function(o){if(F.indexOf(o.getType())>-1){o.onAfterNavigationFrom();}});f();};var F=[];var v=[];var V=t.getValidationExecutor();if(V){v=V(p);}t.getPanels().forEach(function(o){if(!o.onBeforeNavigationFrom()){F.push(o.getType());}});if(F.length||v.length){t.showValidationDialog(c,F,v);}else{f();}}});};b.prototype._createCancelButton=function(){var t=this;return new sap.m.Button({text:this._oResourceBundle.getText("P13NDIALOG_CANCEL"),press:function(){t.fireCancel();}});};b.prototype._createResetButton=function(){var t=this;return new sap.m.Button({text:this._oResourceBundle.getText("P13NDIALOG_RESET"),visible:this.getShowReset(),press:function(){var p={};t.getPanels().forEach(function(o){p[o.getType()]=o.getResetPayload();});t.fireReset({payload:p});}});};b.prototype._getPayloadOfPanels=function(){var p={};this.getPanels().forEach(function(o){p[o.getType()]=o.getOkPayload();});return p;};b.prototype.exit=function(){D.prototype.exit.apply(this,arguments);};return b;},true);