import React from 'react'

import { widget } from 'components'

import { WComponentProps } from 'core/widget'
import { UIPreview } from './UIPreview';

export function popupUIPreview(props: WComponentProps, url: string, params: any) {
  let { appContext, pageContext } = props;
  let ui = (
    <div className='flex-vbox'>
      <UIPreview
        appContext={appContext} pageContext={pageContext}
        url={url} params={params} />
    </div>
  );
  widget.layout.showDialog("Preview", "lg", ui);
}