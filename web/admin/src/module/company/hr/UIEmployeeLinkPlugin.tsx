import React, { ReactFragment } from 'react';
import { app } from 'components';

import { WComponent } from 'core/widget';
import {
  UIEntityLinkPlugin, LINK_PLUGIN_REGISTRY ,
  EntityOnSelect, EntityOnMultiSelect
} from 'core/widget/entity'

import { UIEmployeeList, UIEmployeeListPlugin } from './UIEmployeeList'
import { UIEmployeeUtil } from './UIEmployee';

export class UIEmployeeLinkPlugin extends UIEntityLinkPlugin {
  constructor() {
    super('Employee', 'EntityCustomId', 'company_hr_employee') ;
  }

  createLink(selEntity: any) {
    let link = {
      label: `Employee[${selEntity.label}]`,
      type: this.type,
      linkName: this.linkName,
      linkId: selEntity.loginId
    }
    return link;
  }

  showLinkInfo(uiSource: WComponent, link: any) :  void {
    UIEmployeeUtil.showEmployeeInfo(uiSource, link.linkId, true);
  }

  createSelector(
    appCtx: app.AppContext, pageCtx: app.PageContext, onSelect: EntityOnSelect, onMultiSelect: EntityOnMultiSelect) :  ReactFragment {
    let html = (
      <div className='flex-vbox'>
        <UIEmployeeList
          appContext={appCtx} pageContext={pageCtx} type={'selector'} readOnly={true}
          plugin={new UIEmployeeListPlugin()}
          onSelect={onSelect} onMultiSelect={onMultiSelect} />
      </div>
    );
    return html;
  }
}

LINK_PLUGIN_REGISTRY.register(new UIEmployeeLinkPlugin());