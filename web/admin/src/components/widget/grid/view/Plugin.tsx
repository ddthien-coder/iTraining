import React, { Component, ReactFragment } from 'react';
import { UncontrolledPopover, PopoverBody, PopoverHeader, ButtonGroup } from 'reactstrap'

import { Arrays } from 'components/util/Arrays';
import { IDTracker } from 'components/util/common';
import { FAButton, fas } from 'components/widget/fa';
import { WCheckboxInput, WRadioInput } from 'components/widget/input';
import { DelayEvent, Event, EventButton } from 'components/widget/context';

import { GRID_CHANGE_VIEW_HANDLER } from '../event';
import {
  VGridContext, VGridViewConfig,
  IViewModePlugin, VGridViewProps,
  FieldConfig, FieldGroup
} from '../IVGrid';
import { VGridConfigUtil } from '../util'
import {
  RECORD_TOGGLE_FIELD_HANDLER, RECORD_FIELD_CHANGE_GROUP_HANDLER
} from '../event';

export class FieldControl extends Component<VGridViewProps> {
  viewId = `fields-${IDTracker.next()}`;

  onToggleField(field: FieldConfig) {
    const { context } = this.props;
    RECORD_TOGGLE_FIELD_HANDLER.handle(context, this, new Event().withParam('field', field.name));
    this.forceUpdate();
  }

  onToggleFieldGroup(group: FieldGroup) {
    const { context } = this.props;
    group.visible = !group.visible;
    let fields = context.config.record.fields;
    for (let field of fields) {
      if (Arrays.isIn(group.fields, field.name)) {
        context.getConfigModel().getRecordConfigModel().setVisibleField(field.name, group.visible);
      }
    }
    context.getVGrid().forceUpdateView(true);
    this.forceUpdate();
  }

  onChangeFieldGroup(field: FieldConfig, group: string) {
    const { context } = this.props;
    RECORD_FIELD_CHANGE_GROUP_HANDLER.handle(
      context, this, new Event().withParam('field', field.name).withParam('group', group));
    this.forceUpdate();
  }

  renderFieldOptions() {
    const { context } = this.props;
    let optionLabels = ['Left', 'Middle', 'Right']
    let options = ['fixed-left', 'default', 'fixed-right']
    let fieldsUI = [];
    fieldsUI.push(
      <div key='fields' className='flex-hbox p-1 border-bottom'>
        <div style={{ width: 150 }}>Fields</div>
        <div>Containers</div>
      </div>
    )
    for (let field of context.config.record.fields) {
      if (field.removable === false) continue;
      let select = field.container ? field.container : 'default';
      let fieldState = VGridConfigUtil.getFieldConfigState(field);
      fieldsUI.push(
        <div key={field.name} className='flex-hbox p-1'>
          <div className='flex-hbox' style={{ width: 150 }}>
            <div className='px-1'>
              <WCheckboxInput name={field.name} checked={fieldState.visible ? true : false}
                onInputChange={(_checked) => this.onToggleField(field)} />
            </div>
            <div>{field.label}</div>
          </div>
          <div className='px-1'>
            <WRadioInput name={`group_${field.name}`} select={select} options={options} optionLabels={optionLabels}
              onInputChange={(_oldVal, newVal) => this.onChangeFieldGroup(field, newVal)} />
          </div>
        </div>
      );
    }
    return (<div className='my-1 border'> {fieldsUI}</div>);
  }

  renderGroupFieldOptions() {
    const { context } = this.props;
    let groups = context.config.record.fieldGroups;
    if (!groups) return <></>;

    let groupsUI = [];
    groupsUI.push(
      <div key='group-fields' className='flex-hbox p-1 border-bottom'>
        <div style={{ width: 150 }}>Group Fields</div>
      </div>
    )
    for (let name in groups) {
      let group = groups[name];
      groupsUI.push(
        <div key={name} className='flex-hbox justify-content-between'>
          <div className='px-1'>{group.label}</div>
          <div className='px-1'>
            <WCheckboxInput name={name} checked={group.visible ? true : false}
              onInputChange={(_checked) => this.onToggleFieldGroup(group)} />
          </div>
        </div>
      );

    }
    return (<div className='my-1 border'> {groupsUI}</div>);
  }

  render() {
    let html = (
      <>
        <FAButton id={this.viewId} className='btn-action' outline icon={fas.faCaretDown}>Cols</FAButton>
        <UncontrolledPopover trigger='legacy' popperClassName='popover-z50' placement="bottom" target={this.viewId}>
          <PopoverHeader>Columns Control</PopoverHeader>
          <PopoverBody className='p-1'>
            {this.renderGroupFieldOptions()}
            {this.renderFieldOptions()}
          </PopoverBody>
        </UncontrolledPopover>
      </>
    );
    return html;
  }
}

interface RecordEditorControlState {
  enable: boolean;
  editable: boolean;
  viewId: string;
}
export class RecordEditorControl extends Component<VGridViewProps, RecordEditorControlState> {
  state: RecordEditorControlState = {
    enable: false,
    editable: false,
    viewId: `grid-editor-${IDTracker.next()}`,
  };

  constructor(props: VGridViewProps) {
    super(props);
    const { context, viewName } = props;
    let config = context.config;
    let viewConfig = VGridConfigUtil.getView(config, viewName);
    if (config.record.editor) {
      this.state.editable = VGridConfigUtil.isInViewModes(config.record.editor.supportViewMode, viewConfig.viewMode);
    }
  }

  onToggleEditor = () => {
    const { context } = this.props;
    let enable = !this.state.enable;
    let fields = context.config.record.fields;
    for (let field of fields) {
      let editor = field.editor;
      if (editor) editor.enable = enable;
    }
    this.setState({ enable: enable });
    context.getVGrid().forceUpdateView();
  }

  onToggleFieldEditor(field: FieldConfig) {
    let editor = field.editor;
    if (!editor) throw new Error('Editor cannot be null');
    editor.enable = !editor.enable;
    const { context } = this.props;
    context.getVGrid().forceUpdateView();
  }

  renderFieldOptions() {
    const { context } = this.props;
    let fieldsUI = [];
    for (let field of context.config.record.fields) {
      let editor = field.editor;
      if (!editor) continue;
      fieldsUI.push(
        <div key={field.name} className='flex-hbox justify-content-between p-1'>
          <div>{field.label}</div>
          <div className='px-1 px-1'>
            <WCheckboxInput label="" name={field.name} checked={editor.enable ? true : false}
              onInputChange={(_checked) => this.onToggleFieldEditor(field)} />
          </div>
        </div>
      );
    }
    return fieldsUI;
  }

  render() {
    let { viewId, editable, enable } = this.state;
    if (!editable) return <></>;
    let uiPopupControl = null;
    let toggleIcon = fas.faToggleOff;
    if (enable) {
      toggleIcon = fas.faToggleOn;
      uiPopupControl = (
        <>
          <FAButton id={viewId} outline icon={fas.faCaretDown} />
          <UncontrolledPopover trigger='legacy' popperClassName='popover-z50' placement="bottom" target={viewId}>
            <PopoverHeader>Editor</PopoverHeader>
            <PopoverBody>
              <div className='p-1' style={{ width: 300 }}>
                {this.renderFieldOptions()}
              </div>
            </PopoverBody>
          </UncontrolledPopover>
        </>
      );
    }
    let html = (
      <ButtonGroup>
        <FAButton outline icon={toggleIcon} onClick={this.onToggleEditor}>Editor</FAButton>
        {uiPopupControl}
      </ButtonGroup>
    );
    return html;
  }
}

export class DefaultViewModePlugin implements IViewModePlugin {
  createToolbarViewBtn(
    ctx: VGridContext, _uiSrc: Component, viewConfig: VGridViewConfig, viewName: string): ReactFragment {
    let disabled = ctx.config.view.currentViewName === viewName;
    let label = viewConfig.label ? viewConfig.label : viewName;
    let icon = fas.faTable;
    if (viewConfig.icon) icon = viewConfig.icon;
    return (
      <EventButton key={viewName} className='btn-view' outline
        disabled={disabled} label={label} icon={icon} hint={label} context={ctx}
        event={new DelayEvent(GRID_CHANGE_VIEW_HANDLER).withParam('viewName', viewName)} />
    );
  }

  createToolbarViewControl(
    _ctx: VGridContext, _uiSrc: Component, _viewConfig: VGridViewConfig, _viewName: string): ReactFragment | null {
    return null;
  }
}