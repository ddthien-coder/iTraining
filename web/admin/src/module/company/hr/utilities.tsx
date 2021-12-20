import React from 'react';
import { server, widget } from 'components';

import { WComponent, BeanObserver } from 'core/widget';

import { T, HRRestURL } from './Dependency';
import { UIEmployeeEditor } from './UIEmployee';

export function popupEmployeeInfo(source: WComponent, employeeLoginId: any, title?: string, readOnly?: boolean) {
  let { appContext, pageContext } = source.props;
  let successCB = (response: server.rest.RestResponse) => {
    let employee = response.data;
    let observer = new BeanObserver(employee);
    let content = (
      <UIEmployeeEditor
        appContext={appContext} pageContext={pageContext} readOnly={readOnly || source.canEditEntity(employee)}
        observer={observer} />
    );
    if (!title) title = 'Employee Info';
    widget.layout.showDialog(T(title), 'md', content);
  }
  appContext.serverGET(HRRestURL.employee.load(employeeLoginId), null, successCB);
}