import React, { ReactFragment } from 'react';
import { app } from 'components';

import { WComponent } from 'core/widget';
import {UIEntityLinkPlugin, LINK_PLUGIN_REGISTRY, EntityOnSelect, EntityOnMultiSelect} from 'core/widget/entity'

import { UIAccountList, UIAccountListPlugin } from './UIAccountList'
import { UIAccountUtil } from './UIAccountUtil';

export class UIAccountLinkPlugin extends UIEntityLinkPlugin {
  constructor() {
    super('Account', 'EntityCustomId', 'account_account') ;
  }

  createLink(selEntity: any) {
    let link = {
      label: `Account[${selEntity.fullName}]`,
      type: this.type,
      linkName: this.linkName,
      linkId: selEntity.loginId
    }
    return link;
  }

  showLinkInfo(uiSource: WComponent, link: any) :  void {
    UIAccountUtil.showAccountInfo(uiSource, link.linkId, true);
  }

  createSelector(
    appCtx: app.AppContext, pageCtx: app.PageContext, onSelect: EntityOnSelect, onMultiSelect: EntityOnMultiSelect) :  ReactFragment {
    let html = (
      <div className='flex-vbox'>
        <UIAccountList
          appContext={appCtx} pageContext={pageCtx} type={'selector'} readOnly={true}
          plugin={new UIAccountListPlugin()}
          onSelect={onSelect} onMultiSelect={onMultiSelect} />
      </div>
    );
    return html;
  }
}
LINK_PLUGIN_REGISTRY.register(new UIAccountLinkPlugin());