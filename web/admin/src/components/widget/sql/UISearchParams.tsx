import React from "react";
import moment from 'moment';
import { InputGroupAddon, Badge } from 'reactstrap';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'

import { i18n } from 'components/i18n';
import { SqlSearchParams, Filter, OptionFilter, RangeFilter, OrderBy } from "./type";

import { fas, FAButton, FAIcon } from "components/widget/fa";
import { BBStringField, BBRadioInputField, BBMultiCheckboxInputField, BBDateTimeField, WInput } from "../input";
import { Form, FormGroup } from "components/widget/input";

import { IDTracker } from "components/util/common";
import { formater } from "components/util/text";

const t = i18n.getT(['widget']);
interface UISearchParamsProps {
  searchParams: SqlSearchParams, defaultField?: string, onSubmit: (searchParams: any) => void
}
interface UISearchParamsState { }
export class UISearchParams extends React.Component<UISearchParamsProps, UISearchParamsState> {
  popoverId: string = `ui-sqlquery-popover-${IDTracker.next()}`;

  constructor(props: UISearchParamsProps) {
    super(props);
    this.state = { showFilter: false };
  }

  onKeyDown(winput: WInput, _evt: any, keyCode: number, currInput: any): void {
    if (keyCode === 13) {
      let { searchParams, onSubmit } = this.props;
      winput.updateValue(currInput);
      onSubmit(searchParams);
    }
  }

  onDeleteMaxReturn() {
    let { searchParams, onSubmit } = this.props;
    searchParams.maxReturn = 1000;
    onSubmit(searchParams);
  }

  onDeleteOrderBy() {
    let { searchParams, onSubmit } = this.props;
    if (searchParams.orderBy) {
      delete searchParams.orderBy.selectFields;
      onSubmit(searchParams);
    }
  }

  onDeleteOptionFilter(filter: OptionFilter) {
    let { searchParams, onSubmit } = this.props;
    filter.selectOption = '';
    onSubmit(searchParams);
  }

  setDateTimeRangeFilter(filter: RangeFilter, dayRange: number) {
    let time = moment();
    filter.toValue = time.format('DD/MM/YYYY@23:59:59 +0700');
    time = time.subtract(dayRange, 'days');
    filter.fromValue = time.format('DD/MM/YYYY@00:00:00 +0700');
    this.forceUpdate();
  }

  clearDateTimeRangeFilter(filter: RangeFilter) {
    filter.toValue = '';
    filter.fromValue = '';
    this.forceUpdate();
  }

  render() {
    let { onSubmit, searchParams, defaultField } = this.props;
    if (!defaultField) defaultField = 'search';
    let defaultFilter = this._getFilter(defaultField, searchParams.filters);
    let html = (
      <div>
        <UncontrolledDropdown>
          <DropdownToggle nav caret>
            <FAIcon icon={fas.faSearch} />
          </DropdownToggle>
          <DropdownMenu right style={{ outline: 'none' }}>
            <Form className='ui-sqlquery p-2' style={{ minWidth: 450, maxWidth: 650 }}>
              <FormGroup className='pb-2'>
                <BBStringField
                  bean={defaultFilter} field={'filterValue'} placeholder={t('Search Term')}
                  onKeyDown={
                    (winput: WInput, evt: any, keyCode: number, currInput: any) => {
                      this.onKeyDown(winput, evt, keyCode, currInput);
                    }
                  } />
              </FormGroup>
              {this._renderDateRangeFilters(searchParams.rangeFilters)}
              {this._renderOptionFilters(searchParams.optionFilters)}
              {this._renderOrderBy(searchParams.orderBy)}
              {this._renderMaxReturn(searchParams)}

              <div className='flex-hbox pt-2 border-top justify-content-center'>
                <FAButton icon={fas.faSearch} onClick={() => onSubmit(searchParams)}>Search</FAButton>
              </div>
            </Form>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
    return html;
  }

  _renderCriteriaBadge(searchParams: SqlSearchParams) {
    let orderByBadge = null;
    let optionFilterBadges = null;
    let orderBy = searchParams.orderBy;
    let optionFilters = searchParams.optionFilters;
    if (orderBy && orderBy.selectFields && orderBy.selectFields.length > 0) {
      orderByBadge = (
        <Badge key='orderBy'>
          Order By: [{formater.text.arrayToString(orderBy.selectFields)}] DESC
          <FAButton outline size='sm' icon={fas.faTrashAlt} onClick={() => this.onDeleteOrderBy()} />
        </Badge>
      );
    }
    if (optionFilters && optionFilters.length > 0) {
      optionFilterBadges = [];
      for (let i = 0; i < optionFilters.length; i++) {
        let filter = optionFilters[i];
        if (!filter.selectOption) continue;
        optionFilterBadges.push(
          <Badge key={i}>
            {filter.label}: {filter.selectOption}
            <FAButton outline size='sm' icon={fas.faTrashAlt} onClick={() => this.onDeleteOptionFilter(filter)} />
          </Badge>
        );
      }
    }
    let html = (
      <InputGroupAddon addonType="prepend">
        <Badge key='limit'>
          Limit: {searchParams.maxReturn}
          <FAButton disabled outline size='sm' icon={fas.faTrashAlt} onClick={() => this.onDeleteMaxReturn()} />
        </Badge>
        {optionFilterBadges}
        {orderByBadge}
      </InputGroupAddon>
    );
    return html;
  }

  _renderMaxReturn(searchParams: SqlSearchParams) {
    let opts = [1000, 5000, 10000, 30000, 50000, 100000];
    let html = (
      <div>
        <h5 className='border-bottom'>Max Return</h5>
        <FormGroup>
          <BBRadioInputField bean={searchParams} field={'maxReturn'} options={opts}
            disable={false} onInputChange={() => console.log('todo..')} />
        </FormGroup>
      </div>
    )
    return html;
  }

  _renderOrderBy(orderBy?: OrderBy): any {
    if (!orderBy) return [];
    let orderSort = ['ASC', 'DESC'];
    let orderSortLabel = [t('ASC'), t('DESC')];
    let fields: Array<any> = orderBy.fields;
    let fieldLabels: Array<any> = fields;
    if (orderBy.fieldLabels) fieldLabels = orderBy.fieldLabels;
    let html = (
      <div>
        <h5 className='border-bottom'>Order By</h5>
        <FormGroup>
          <div className='d-flex'>
            <div>
              <label>{'Field'}:</label>
              <BBMultiCheckboxInputField bean={orderBy} field={'selectFields'} options={fields} optionLabels={fieldLabels} disable={false} />
            </div>

            <div className="ml-2" style={{ minWidth: 100 }}>
              <label>{'Sort'}:</label>
              <BBRadioInputField bean={orderBy} field={'sort'} options={orderSort} optionLabels={orderSortLabel}
                disable={false} />
            </div>
          </div>
        </FormGroup>
      </div>
    )
    return html;
  }

  _getFilter(field: string, filters?: Array<Filter>): any {
    if (filters == null) return null;
    for (let i = 0; i < filters.length; i++) {
      let filter = filters[i];
      if (filter.name === field) return filter;
    }
    return null;
  }

  _renderFilters(defaultField: string, filters?: Array<Filter>): any {
    if (!filters) return [];
    let rows = [];
    for (let i = 0; i < filters.length; i++) {
      let filter = filters[i];
      if (filter.name === defaultField) continue;
      let label = filter.label;
      if (!label) label = filter.name;
      let html = (
        <FormGroup key={i}>
          <label>{label}</label>
          <BBStringField bean={filter} field={'filterValue'} placeholder={t('Filter Value')} />
        </FormGroup>
      );
      rows.push(html);
    }
    return rows;
  }

  _renderOptionFilters(filters?: Array<OptionFilter>): any {
    if (!filters) return [];
    let optionEles = [];
    for (let i = 0; i < filters.length; i++) {
      let filter = filters[i];
      let optionLabels = filter.optionLabels ? filter.optionLabels : filter.options;
      optionEles.push(
        <FormGroup className='py-2' key={i}>
          <label>{filter.label ? filter.label : filter.name}</label>
          <BBRadioInputField
            bean={filter} field={'selectOption'} options={filter.options} optionLabels={optionLabels}
            disable={false} onInputChange={() => console.log('todo ' + filter.name)} />
        </FormGroup>
      );
    }
    return (
      <div>
        <h5 className='border-bottom'>Filters</h5>
        <div className='py-1'>
          {optionEles}
        </div>
      </div>
    );
  }

  _renderDateRangeFilters(filters?: Array<RangeFilter>): any {
    if (!filters) return [];
    let rows = [];
    for (let i = 0; i < filters.length; i++) {
      let filter = filters[i];
      let html = (
        <FormGroup className='py-2' key={i}>
          <label>{filter.label ? filter.label : filter.name}</label>
          <div className='d-inline-block'>
            [
            <span>Last:</span>
            <FAButton color='link' onClick={() => this.setDateTimeRangeFilter(filter, 7)}>7D</FAButton>
            <FAButton className='px-1' color='link'
              onClick={() => this.setDateTimeRangeFilter(filter, 30)}>1M</FAButton>
            <FAButton className='px-1' color='link'
              onClick={() => this.setDateTimeRangeFilter(filter, 92)}>3M</FAButton>
            <FAButton className='px-1' color='link'
              onClick={() => this.setDateTimeRangeFilter(filter, 183)}>6M</FAButton>
            <FAButton className='px-1' color='link'
              onClick={() => this.setDateTimeRangeFilter(filter, 365)}>1Y</FAButton>
            <FAButton className='px-1' color='link'
              onClick={() => this.setDateTimeRangeFilter(filter, 730)}>2Y</FAButton>
            <FAButton className='px-1' color='link'
              onClick={() => this.setDateTimeRangeFilter(filter, 1095)}>3Y</FAButton>
            <FAButton className='px-1' color='link' icon={fas.faTrashAlt}
              onClick={() => this.clearDateTimeRangeFilter(filter)} />
            ]
          </div>
          <div className='flex-hbox py-1'>
            <BBDateTimeField bean={filter} field={'fromValue'} timeFormat={false} />
            <span className='d-inline px-2'>..</span>
            <BBDateTimeField bean={filter} field={'toValue'} timeFormat={false} />
          </div>
        </FormGroup>
      );
      rows.push(html);
    }
    let html = (
      <div>
        <h5 className='border-bottom'>{t("Range Filter")}</h5>
        {rows}
      </div>
    );
    return html;
  }
}