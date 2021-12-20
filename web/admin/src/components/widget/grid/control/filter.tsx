import React, { Component } from "react";

import { ListRecordMap } from 'components/util/Collections';
import { FAButton } from 'components/widget/fa';
import { VGridContextProps } from "../IVGrid";
import { ALL } from "../model/RecordFilter";

function toLowerCase(string?: string) {
  if (!string) return '';
  return string.toLocaleLowerCase();
}

function sortCountReport(c1: any, c2: any) {
  let label1 = toLowerCase(c1.label);
  let label2 = toLowerCase(c2.label);
  if (label1 === label2) return 0;
  let result = (label1 > label2) ? 1 : -1;
  return result;
};

export class CountReport {

  label: string;
  field: string;
  value?: string;
  count: number;
  select: boolean;

  constructor(label: string, field: string, value: string | undefined, count: number, select: boolean) {
    this.label = label;
    this.field = field;
    this.value = value;
    this.count = count;
    this.select = select;
  }
}

export class CountReportFilter {
  title: string;
  recordFieldName: string;
  countReports: Array<CountReport>;

  constructor(title: string, fieldName: string, records: Array<any>) {
    this.title = title;
    this.recordFieldName = fieldName;
    let listMap = new ListRecordMap().addAllRecords(fieldName, records);
    let holder = new Array<CountReport>();
    holder.push(new CountReport('All', fieldName, ALL, -1, true));
    for (let name of listMap.getListNames()) {
      let listRecordHolder = listMap.getListRecordHolder(name);
      holder.push(new CountReport(name, fieldName, listRecordHolder.value, listRecordHolder.records.length, false));
    }
    holder.sort(sortCountReport);
    this.countReports = holder;
  }
}

interface UICountReportFilterProps extends VGridContextProps {
  filter?: CountReportFilter;
}
export class UICountReportFilter extends Component<UICountReportFilterProps> {
  selectBean?: any;

  onSelect = (countReport: CountReport) => {
    let { context, filter } = this.props;
    if (!filter) throw new Error('Invalid State');
    for (let sel of filter.countReports) {
      if (sel === countReport) {
        sel.select = true;
      } else {
        sel.select = false;
      }
    }
    context.model.getRecordFilter().addFieldValueFilter(countReport.field, countReport.field, countReport.value);
    context.model.filter();
    context.getVGrid().forceUpdateView();
    this.forceUpdate();
  }

  render() {
    let { filter } = this.props;
    if (!filter) return <div>Loadding...</div>
    let links = [];
    for (let i =0; i < filter.countReports.length; i++) {
      let summary = filter.countReports[i];
      let label = summary.label;
      if (summary.count >= 0) label += `(${summary.count})`
      links.push(
        <div key={i}>
          <FAButton className='d-block text-left' color='link'
            onClick={() => this.onSelect(summary)} disabled={summary.select}>
            {label}
          </FAButton>
        </div>
      )
    }
    return (
      <div className='flex-vbox-grow-0 py-1'>
        <h6>{filter.title}</h6>
        {links}
      </div>
    );
  }
}