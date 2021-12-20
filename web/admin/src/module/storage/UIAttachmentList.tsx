import React from 'react';
import { widget, util, server } from 'components';

import {
  ComplexBeanObserver, VGridEntityListEditorPlugin,
} from 'core/entity';

import { WComponent, WComponentProps, WToolbar } from '../../core/widget/WLayout';
import { WButtonEntityWrite } from 'core/widget/entity';

import {
  VGridConfigTool, VGridEntityListEditor, VGridEntityListEditorProps
} from '../../core/widget/vgrid';

import { T } from './Dependency'
import { WPreviewThumbnail } from './UIPreview';
import { WUploadResourceList, UploadResource } from './WUploadResource';
import { AttachmentPlugin, UIAttachmentForm } from './UIAttachment';

import VGridConfig = widget.grid.VGridConfig;
import VGridContext = widget.grid.VGridContext;
import DisplayRecord = widget.grid.model.DisplayRecord;

const { fas } = widget.fa;
interface UIAttachmentListEditorProps extends VGridEntityListEditorProps {
  attachmentPlugin: AttachmentPlugin;
  onUploadSuccess?: () => void;
}
export class UIAttachmentListEditor extends VGridEntityListEditor<UIAttachmentListEditorProps> {
  renderBeanEditor() {
    let { appContext, pageContext, attachmentPlugin, readOnly } = this.props;
    let observer = this.createBeanObserver('complex');
    return (
      <UIAttachmentForm
        appContext={appContext} pageContext={pageContext} readOnly={readOnly}
        plugin={attachmentPlugin} observer={observer as ComplexBeanObserver} />
    );
  }

  needSelector() {
    const { readOnly } = this.props;
    return !readOnly;
  }

  createVGridConfig() {
    let { readOnly } = this.props;
    if (readOnly === undefined) readOnly = true;

    let config: VGridConfig = {
      record: {
        fields: [
          ...VGridConfigTool.FIELD_SELECTOR(this.needSelector()),
          VGridConfigTool.FIELD_INDEX(),
          VGridConfigTool.FIELD_ON_SELECT('label', T('Label'), 200),

          { name: 'name', label: 'Name', width: 200 },
          { name: 'logicalStoragePath', label: "Logical Storage", width: 300 },
          { name: 'size', label: 'Size', width: 100 },
          { name: 'description', label: 'Description', width: 300 },
          ...VGridConfigTool.FIELD_ENTITY
        ]
      },
      toolbar: {
        actions: [
          ...VGridConfigTool.TOOLBAR_ON_ADD(readOnly, "Add"),
          ...VGridConfigTool.TOOLBAR_ON_DELETE(readOnly, "Del"),
        ]
      },
      view: {
        currentViewName: 'grid',
        availables: {
          table: {
            viewMode: 'table'
          },
          grid: {
            viewMode: 'grid',
            rowHeight: 150,
            renderRecord: (_ctx: VGridContext, dRecord: DisplayRecord) => {
              let uiList = _ctx.uiRoot as UIAttachmentListEditor;
              let { appContext, pageContext } = uiList.props;
              const attachment = dRecord.record;
              let html = (
                <WPreviewThumbnail appContext={appContext} pageContext={pageContext}
                  label={attachment.label} url={attachment.downloadUri} />
              );
              return html;
            }
          },
        }
      }
    }
    return config;
  }

  onUpload = (uploadResources: Array<UploadResource>) => {
    let { plugin, onUploadSuccess } = this.props;
    for (let i = 0; i < uploadResources.length; i++) {
      let resource = uploadResources[i];
      let attachment = {
        name: resource.name, label: resource.name, size: resource.size, uploadResource: resource
      }
      plugin.getModel().addRecord(attachment);
    }
    if (onUploadSuccess) onUploadSuccess();
    else this.forceUpdate();
  }

  onNewAction() {
    let { appContext } = this.props;
    let newPageCtx = this.newPopupPageContext()
    let rest = appContext.getServerContext().getRestClient();
    let content = (
      <div className='flex-vbox' style={{ height: 300 }}>
        <WUploadResourceList
          appContext={appContext} pageContext={newPageCtx} multiple={true} rest={rest}
          onUpload={this.onUpload} />
      </div>
    );
    widget.layout.showDialog('Upload Attachments', 'md', content, newPageCtx.getDialogContext());
  }
}

interface UIAttachmentsProps extends WComponentProps {
  attachments?: Array<any>;
  commitURL: string;
  loadURL: string;
  onChange?: (plugin: VGridEntityListEditorPlugin) => void
}
export class UIAttachments extends WComponent<UIAttachmentsProps> {
  plugin: VGridEntityListEditorPlugin;

  constructor(props: UIAttachmentsProps) {
    super(props);
    let { attachments } = props;
    this.plugin = new VGridEntityListEditorPlugin([]);
    if (attachments) {
      this.plugin.getModel().update(attachments);
    } else {
      this.loadData(true);
      this.markLoading(true);
    }
  }

  loadData(_forceReload: boolean = true) {
    let { appContext, loadURL, onChange } = this.props;
    let successCB = (response: server.rest.RestResponse) => {
      let attachments = response.data;
      this.plugin.replaceBeans(attachments);
      if (onChange) onChange(this.plugin);
      this.markLoading(false).forceUpdate();
    }
    appContext.serverGET(loadURL, {}, successCB);
  }

  saveAttachments() {
    let { appContext, commitURL, onChange } = this.props;
    let successCB = (result: any) => {
      let savedAttachments: Array<any> = result.data;
      this.plugin.replaceWith(savedAttachments);
      if (onChange) onChange(this.plugin);
      this.forceUpdate();
      appContext.addOSNotification("success", T(`Add Attachment Success`));
    };
    let failCB = (result: any) => {
      appContext.addOSNotification('danger', T('Add Attachment Fail'), null, result.data);
    };
    let attachments: Array<any> = this.plugin.commitAndGet();
    appContext.serverPUT(commitURL, attachments, successCB, failCB);
  }

  onUploadSuccess = () => { this.saveAttachments(); }

  render() {
    if (this.isLoading()) return this.renderLoading();
    let { appContext, pageContext, readOnly } = this.props;
    let attachmentPlugin = new AttachmentPlugin();
    let html = (
      <div className='flex-vbox'>
        <UIAttachmentListEditor
          plugin={this.plugin} appContext={appContext} pageContext={pageContext} readOnly={readOnly}
          attachmentPlugin={attachmentPlugin}
          onUploadSuccess={this.onUploadSuccess}
          dialogEditor={true} editorTitle={'Upload'} />

        <WToolbar readOnly={readOnly}>
          <WButtonEntityWrite
            appContext={appContext} pageContext={pageContext}
            icon={fas.faUpload} label={'Save'} onClick={() => this.saveAttachments()} />
        </WToolbar>
      </div>
    );
    return html;
  }
}
export class WPopupAttachments extends WComponent<UIAttachmentsProps> {
  id = util.common.IDTracker.next();
  attachments: Array<any> | null = null;

  componentDidMount() {
    let { appContext, loadURL } = this.props;
    let successCB = (response: server.rest.RestResponse) => {
      this.attachments = response.data;
      this.forceUpdate();
    }
    appContext.serverGET(loadURL, {}, successCB);
  }

  onChange = (plugin: VGridEntityListEditorPlugin) => {
    this.attachments = plugin.getModel().getRecords();
  }

  onTogglePopup = (open: boolean) => {
    if (!open) this.forceUpdate();
  }

  render() {
    if (!this.attachments) return this.renderLoading();
    let { appContext, pageContext, loadURL, commitURL, readOnly } = this.props;
    let { PopoverButton } = widget.element;
    let customLabel = `Attachments(${this.attachments.length})`;
    let html = (
      <PopoverButton
        id={`popover-${this.id}`} label={customLabel} faIcon={fas.faFile}
        popover={{ title: 'Attachments', open: false, trigger: 'click' }}
        onToggle={this.onTogglePopup}>
        <div className='flex-vbox' style={{ width: 500, height: 300 }}>
          <UIAttachments
            appContext={appContext} pageContext={pageContext} readOnly={readOnly}
            attachments={this.attachments}
            commitURL={commitURL} loadURL={loadURL}
            onChange={this.onChange} />
        </div>
      </PopoverButton>
    );
    return html;
  }
}