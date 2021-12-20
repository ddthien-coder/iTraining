import React, { ReactFragment } from "react";
import { Component } from "react";
import { formater } from "components/util/text";
import { fas, FAButton } from "components/widget/fa";
import { MouseMove, MouseMovePlugin } from 'components/widget/graphic'
import { VGridContextProps, FieldConfig, VGridContext } from '../IVGrid'
import { VGridUtil } from "../util";

export function formatCellValue(field: any, val: any): any {
  if (val == null) return null;
  if (field.format) return field.format(val);

  if (typeof val.getMonth === 'function') return formater.dateTime(val);
  else if (typeof val === 'number') return formater.number(val);
  else if (typeof val === 'boolean') return val ? 'True' : 'False';
  return val;
}

class ColumnResizePlugin extends MouseMovePlugin {
  context: VGridContext;
  field: FieldConfig;

  constructor(context: VGridContext, field: FieldConfig) {
    super();
    this.context = context;
    this.field = field;
  }

  onStop = (initX: number, _initY: number, X: number, _Y: number) => {
    let deltaX = X - initX;
    VGridUtil.resizeField(this.context, this.field, deltaX);
  }
}

export interface HeaderCellProps extends VGridContextProps {
  className?: string;
  style?: any;
  field: FieldConfig;
}
export class HeaderCell<S = any> extends Component<HeaderCellProps, S> {
  onSort(field: FieldConfig, desc: boolean) {
    const { context } = this.props;
    context.model.sort(field.name, desc);
    context.getVGrid().forceUpdateView();
  }

  onToggleField(field: FieldConfig) {
    const { context } = this.props;
    context.configModel.getRecordConfigModel().setVisibleField(field.name, false);
    context.getVGrid().forceUpdateView(true);
  }

  renderSortableButtons(field: FieldConfig) {
    let sortBtns = null;
    if (field.sortable) {
      sortBtns =
        <>
          <FAButton key='asc' color='link' icon={fas.faCaretSquareDown} onClick={() => this.onSort(field, false)} />
          <FAButton key='desc' color='link' icon={fas.faCaretSquareUp} onClick={() => this.onSort(field, true)} />
        </>;
    }
    return sortBtns;
  }

  renderRemovableButton(field: FieldConfig) {
    let visibleBtn = null;
    if (field.removable !== false) {
      visibleBtn =
        <FAButton key='visibility' color='link' icon={fas.faEye} onClick={() => this.onToggleField(field)} />
    }
    return visibleBtn;
  }

  renderLabel(field: FieldConfig): ReactFragment {
    let label = field.label;
    let width = field.width ? field.width : 120;
    if (width < 120) {
      label = formater.truncate(label, 5, true);
    }
    return <div className='flex-hbox-grow-0'>{label}</div>;
  }

  renderContent(field: FieldConfig) {
    let sortBtns = this.renderSortableButtons(field);
    let visibleBtn = this.renderRemovableButton(field);
    let btnWidth = 0;
    if (sortBtns) btnWidth += 30;
    if (visibleBtn) btnWidth += 15;
    let html = (
      <div className='flex-hbox justify-content-between'>
        {this.renderLabel(field)}
        <div style={{ minWidth: btnWidth }}>
          {sortBtns}
          {visibleBtn}
        </div>
      </div>
    );
    return html;
  }

  renderResizable(context: VGridContext, field: FieldConfig) {
    let html = (
      <div className='flex-hbox'>
        <div className='flex-hbox'>
          {this.renderContent(field)}
        </div>
        <div className='flex-hbox-grow-0'
          style={{ minWidth: 5, cursor: 'ew-resize' }}
          onMouseDown={(me) => MouseMove(me, new ColumnResizePlugin(context, field))} />
      </div>
    );
    return html;
  }

  render() {
    const { style, context, field } = this.props;
    let uiContent = null;
    if (field.resizable == false) {
      uiContent = this.renderContent(field);
    } else {
      uiContent = this.renderResizable(context, field);
    }
    let html = (
      <div className={`cell cell-header`} style={style}>{uiContent}</div>
    );
    return html;
  }
}