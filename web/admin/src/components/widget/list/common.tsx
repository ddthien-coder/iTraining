import React from "react";
import { Component } from "react";

import { ButtonGroup } from 'reactstrap';

import { formater } from "components/util/text";
import PageList from "components/util/PageList";

import { FAButton, fas } from "components/widget/fa";

export function formatCellValue(field: any, val: any): any {
  if (val == null) return null;
  if (field.format) return field.format(val);

  if (typeof val.getMonth === 'function') return formater.dateTime(val);
  else if (typeof val === 'number') return formater.number(val);
  else if (typeof val === 'boolean') return val ? 'True' : 'False';
  return val;
}

export interface PageIteratorProps { pageList: PageList, onSelectPage: (page: number) => void }
export class PageIterator extends Component<PageIteratorProps, {}> {
  shouldComponentUpdate() { return true; }

  render() {
    const { pageList, onSelectPage } = this.props;
    let buttons = [];
    let cpage = pageList.getCurrentPage();
    let range = pageList.getSubRange(cpage, 10);

    if (pageList.getCurrentPage() > 1) {
      buttons.push(<FAButton key='first' icon={fas.faAngleDoubleLeft} onClick={() => onSelectPage(1)} />);
      buttons.push(<FAButton key='prev' icon={fas.faAngleLeft} onClick={() => onSelectPage(cpage - 1)} />);
    } else {
      buttons.push(<FAButton key='first' icon={fas.faAngleDoubleLeft} disabled={true} />);
      buttons.push(<FAButton key='prev' icon={fas.faAngleLeft} disabled={true} />);
    }

    for (let i = range[0]; i <= range[1]; i++) {
      if (i === cpage) {
        buttons.push((<FAButton key={'p' + i} disabled={true}>{i}</FAButton>));
      } else {
        buttons.push((<FAButton key={'p' + i} onClick={() => onSelectPage(i)}>{i}</FAButton>));
      }
    }
    let lastPage = pageList.getAvailablePage();

    if (pageList.getCurrentPage() < lastPage) {
      buttons.push(
        <FAButton key='next' icon={fas.faAngleRight} onClick={() => onSelectPage(cpage + 1)} />
      );
      buttons.push(
        <FAButton key='last' icon={fas.faAngleDoubleRight} onClick={() => onSelectPage(lastPage)} />
      );
    } else {
      buttons.push(<FAButton key='next' icon={fas.faAngleRight} disabled={true} />);
      buttons.push(<FAButton key='last' icon={fas.faAngleDoubleRight} disabled={true} />);
    }

    let html = (
      <div className='page-iterator'>
        <ButtonGroup size='sm'> {buttons} </ButtonGroup>
      </div>
    );
    return html;
  }
}