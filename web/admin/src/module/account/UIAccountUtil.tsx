import React from 'react';
import {  widget } from 'components'
import { WComponent } from 'core/widget';
import { T } from './Dependency';
import { UILoadableAccountInfo } from './UIAccountInfo';

export class UIAccountUtil {
  static showAccountInfo(uiSource: WComponent, loginId: string, popup: boolean = false) {
    let { appContext, pageContext } = uiSource.props;
    if (popup) {
      let popupPageCtx = pageContext.createPopupPageContext();
      let html = (
        <UILoadableAccountInfo appContext={appContext} pageContext={popupPageCtx} loginId={loginId} />);
      widget.layout.showDialog("Account", 'lg', html, popupPageCtx.getDialogContext());
    } else {
      let html = (
        <UILoadableAccountInfo appContext={appContext} pageContext={pageContext} loginId={loginId} />);
      pageContext.onAdd('account-detail', T(`Account {{loginId}}`, { loginId: loginId }), html);
    }
  }
}