import React, { ReactFragment } from 'react';
import { widget, app } from 'components';

import { IArrayObserver } from 'core/entity';

import { WEntity, EntityOnSelect, EntityOnMultiSelect } from './WEntity';
import { WComponent, WComponentProps } from '../WLayout';
import { VGridConfigTool, VGridEntityListEditor } from '../vgrid';

import { T } from '../Dependency';

import fas = widget.fa.fas;
import FAButton = widget.fa.FAButton;
import ButtonActionModel = widget.element.ButtonActionModel;
import DropdownActionButton = widget.element.DropdownActionButton;

import VGridConfig = widget.grid.VGridConfig;

export class UIReferenceForm extends WEntity {
  render() {
    let { observer, readOnly } = this.props;
    let reference = observer.getMutableBean();
    const { Form, FormGroup, BBStringField, BBSelectField, BBTextField } = widget.input;
    let typeOpts = ['EntityId', 'EntityCustomId', 'Http']
    let errorCollector = observer.getErrorCollector();
    return (
      <Form>
        <FormGroup label={T('Label')}>
          <BBStringField bean={reference} field={'label'} disable={readOnly} required errorCollector={errorCollector} />
        </FormGroup>
        <FormGroup label={T('Type')}>
          <BBSelectField bean={reference} field={'type'} options={typeOpts} disable={readOnly} />
        </FormGroup>
        <FormGroup label={T('Link Name')}>
          <BBStringField bean={reference} field={'linkName'} disable={readOnly} required
            errorCollector={errorCollector} />
        </FormGroup>
        <FormGroup label={T('Link Id')}>
          <BBStringField bean={reference} field={'linkId'} disable={readOnly} required
            errorCollector={errorCollector} />
        </FormGroup>
        <FormGroup label={T('Description')}>
          <BBTextField bean={reference} field={'description'} disable={readOnly} />
        </FormGroup>
      </Form>
    );
  }
}

export class UIEntityLinkListEditor extends VGridEntityListEditor {
  renderBeanEditor() {
    let { appContext, pageContext, readOnly } = this.props;
    let observer = this.createBeanObserver();
    return (<UIReferenceForm appContext={appContext} pageContext={pageContext}
      observer={observer} readOnly={readOnly} />);
  }

  createVGridConfig() {
    let { readOnly } = this.props;
    if (readOnly === undefined) {
      readOnly = true;
    }

    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(!readOnly),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 200),
          { name: 'type', label: T('Link Type') },
          { name: 'linkName', label: T('Link Name') },
          { name: 'linkId', label: T('Link Id'), width: 200 },
          { name: 'description', label: T('Description') },
        ]
      },
      toolbar: {
        actions: [
          ...VGridConfigTool.TOOLBAR_ON_ADD(readOnly, "Add"),
          ...VGridConfigTool.TOOLBAR_ON_DELETE(readOnly, "Del"),
        ]
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          },
        }
      }
    }
    return config;
  }
}

type EntityLinkType = 'EntityId' | 'EntityCustomId' | 'Http';
export abstract class UIEntityLinkPlugin {
  id: string;
  label: string;
  type: EntityLinkType;
  linkName: string;

  constructor(label: string, type: EntityLinkType, linkName: string) {
    this.label = label;
    this.type = type;
    this.linkName = linkName;
    this.id = type + ":" + linkName;
  }

  createLink(selEntity: any) {
    let link = {
      label: `${this.label}[${selEntity.id}]`,
      type: this.type,
      linkName: this.linkName,
      linkId: selEntity.id
    }
    return link;
  }

  renderLabel(entityLink: any): ReactFragment {
    let html = (
      <div className='d-inline-block'>{entityLink.label}</div>
    );
    return html;
  }

  abstract showLinkInfo(uiSource: WComponent, link: any): void;

  abstract createSelector(
    appCtx: app.AppContext, pageCtx: app.PageContext, onSelect: EntityOnSelect, onMultiSelect: EntityOnMultiSelect): ReactFragment;
}

export class UIEntityLinkPluginManager {
  plugins: Record<string, UIEntityLinkPlugin> = {};

  register(plugin: UIEntityLinkPlugin) {
    if (this.plugins[plugin.id]) {
      throw new Error(`A plugin with id ${plugin.id} is already registered`);
    }
    this.plugins[plugin.id] = plugin;
  }

  getPlugin(type: string, name: string) {
    return this.getPluginById(`${type}:${name}`);
  }

  getPluginById(id: string) {
    let plugin = this.plugins[id];
    if (!plugin) {
      throw new Error(`Cannot find a plugin with id ${id}`);
    }
    return plugin;
  }

  getPluginByLink(linkEntity: any) {
    let id = `${linkEntity.type}:${linkEntity.linkName}`;
    return this.getPluginById(id);
  }
}

export const LINK_PLUGIN_REGISTRY = new UIEntityLinkPluginManager();

export interface BBEntityLinkFieldProps extends WComponentProps {
  observer: IArrayObserver;
  linkPluginManager: UIEntityLinkPluginManager
}
export class BBEntityLinkField extends WComponent<BBEntityLinkFieldProps> {
  selectPlugin: UIEntityLinkPlugin | null = null;

  onRemove(entity: any) {
    let { observer } = this.props;
    observer.removeRecord(entity);
    this.forceUpdate();
  }

  onSelect = (appCtx: app.AppContext, pageCtx: app.PageContext, entity: any) => {
    this.onMultiSelect(appCtx, pageCtx, [entity]);
  }

  onMultiSelect = (_appCtx: app.AppContext, pageCtx: app.PageContext, entities: Array<any>) => {
    pageCtx.onBack();
    let { observer } = this.props;
    let plugin = this.selectPlugin;
    if (!plugin) throw new Error();
    let links = [];
    for (let entity of entities) {
      let link = plugin.createLink(entity);
      links.push(link);
    }
    observer.addRecords(links);
    this.forceUpdate();
  }

  onSelectPlugin = (item: ButtonActionModel) => {
    let { appContext, pageContext, linkPluginManager } = this.props;
    this.selectPlugin = linkPluginManager.getPluginById(item.name);
    let popupPageCtx = pageContext.createPopupPageContext();
    let uiSelector = this.selectPlugin.createSelector(appContext, popupPageCtx, this.onSelect, this.onMultiSelect);
    widget.layout.showDialog('Select', 'lg', uiSelector, popupPageCtx.getDialogContext());
  }

  onLinkClick(link: any) {
    let { linkPluginManager } = this.props;
    let plugin = linkPluginManager.getPluginByLink(link);
    plugin.showLinkInfo(this, link);
  }

  render() {
    let { observer, linkPluginManager, readOnly } = this.props;
    let entityLinks = observer.getMutableArray();
    let uiLabels = [];
    for (let link of entityLinks) {
      let plugin = linkPluginManager.getPluginByLink(link);
      let uiLabel = (
        <div className='flex-hbox-grow-0 border mx-1'>
          <FAButton color='link' onClick={() => this.onLinkClick(link)}>{plugin.renderLabel(link)}</FAButton>
          {readOnly ? null : (<FAButton color='link' icon={fas.faTrashAlt} onClick={() => this.onRemove(link)} />)}
        </div>
      );
      uiLabels.push(uiLabel);
    }
    let pluginSelectors = [];
    for (let pluginId in linkPluginManager.plugins) {
      let plugin = linkPluginManager.getPluginById(pluginId);
      const actionModel: ButtonActionModel = {
        name: plugin.id, label: T(plugin.label), onSelect: this.onSelectPlugin
      }
      pluginSelectors.push(actionModel);
    }

    let html = (
      <div className='flex-hbox-grow-0'>
        {uiLabels}
        {readOnly ? null : (
          <DropdownActionButton className='py-0 pl-1' color='link'
            faIcon={widget.fa.fas.faPlus} items={pluginSelectors} label={T('Add')} />
        )}
      </div>
    );
    return html;
  }
}
