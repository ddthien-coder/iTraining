
import React, { Component } from 'react'
import { BrowserRouter, Link } from "react-router-dom";
import { widget, app } from "components";

import {
  WComponentProps, WComponent
} from "./WLayout";

const { FAButton } = widget.fa;

interface WLinkProps {
  label: string;
  to: string;
  target?: string;
  type?: 'external';
}
export class WLink extends Component<WLinkProps> {
  render() {
    let { label, to, target, type } = this.props;
    let downloadUrl = to;
    if (type == 'external') {
    } else {
      downloadUrl = `${app.host.CONFIG.getServerUrl()}/${to}`;
    }
    return (<BrowserRouter><Link target={target} to={{ pathname: downloadUrl }}>{label}</Link></BrowserRouter>);
  }
}

interface WBeanMenuProps extends WComponentProps {
  menuLabel: string;
  beans: Array<any>;
  beanLabel: (bean: any) => any;
  onSelect: (bean: any) => void;
}
export class WBeanMenu extends WComponent<WBeanMenuProps> {
  selectBean?: any;

  onSelect = (bean: any) => {
    let { onSelect } = this.props;
    this.selectBean = bean;
    onSelect(bean);
    this.forceUpdate();
  }

  createLink(bean: any) {
    let { beanLabel } = this.props;
    let label = "All";
    let disable = false;
    if (bean) {
      label = beanLabel(bean);
      if (this.selectBean == bean) disable = true;
    } else {
      if (this.selectBean == undefined && bean == undefined) disable = true;
    }
    return (
      <div key={label}>
        <FAButton color='link' onClick={() => this.onSelect(bean)} disabled={disable}>{label}</FAButton>
      </div>
    );
  }

  render() {
    let { menuLabel, beans } = this.props;
    let beanLinks = [this.createLink(undefined)];
    for (let bean of beans) {
      beanLinks.push(this.createLink(bean))
    }
    return (
      <div className='flex-vbox-grow-0 py-1'>
        <strong>{menuLabel}</strong>
        <div className='flex-vbox-grow-0 pl-1'>
          {beanLinks}
        </div>
      </div>
    );
  }
}