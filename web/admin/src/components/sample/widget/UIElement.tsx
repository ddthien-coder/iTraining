import React, { Component } from "react";
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AutoRefreshButton } from 'components/widget/element'
import { i18n } from 'components/i18n';

class UIElement extends Component<any> {
  render() {
    let t = i18n.getT(['widget.sql']);
    let html = (
      <div>
        <div>
          <h3>Font Awesome</h3>
          <div><FontAwesomeIcon icon={faCoffee} fixedWidth /> Hello FA5</div>
        </div>

        <div>
          <h3>Translation</h3>
          <div>{t('Welcome')}</div>
          <div>{t('keyWithParams', { value1: "'value 1'", value2: "'value 2'" })}</div>
          <div>{t('Filter Expression')}</div>
        </div>

        <div>
          <h3>Elements</h3>
          <div>
            <AutoRefreshButton id='autorefresh' defaultPeriod={10} onRefresh={() => console.log('auto refresh...')} />
          </div>
        </div>
      </div>
    );
    console.log(i18n.getDataByLanguage('en'));
    return html;
  }
}
//const UIElementDemo = withTranslation() (UIElement)
export { UIElement as UIElementDemo }