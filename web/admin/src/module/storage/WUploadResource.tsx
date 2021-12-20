import React, { Component, ReactFragment } from 'react';
import { app, widget, server, reactstrap, util } from 'components';

import { WComponent, WComponentProps } from 'core/widget'
import {
  VGridEntityListPlugin, VGridConfigTool
} from 'core/widget/vgrid';

import IDTracker = util.IDTracker;

import VGrid = widget.grid.VGrid;
import VGridContext = widget.grid.VGridContext;
import VGridConfig = widget.grid.VGridConfig;

const { fas } = widget.fa;

export interface UploadResource {
  storeId: string;
  name: string;
  resourceUri: string;
  downloadUri: string;
  contentType: string;
  size: number;
}
interface WUploadResourceProps extends WComponentProps {
  label: string,
  multiple?: boolean,
  maxSize?: number;
  onUploadSuccess: (uploadResponse: any) => void,
  onRemoveSuccess?: (resource: any) => void,
};
type WUploadResourceState = { id: string, resourceMap: any };
export class WUploadResource extends WComponent<WUploadResourceProps, WUploadResourceState> {
  constructor(props: WUploadResourceProps) {
    super(props);
    this.state = { id: `${IDTracker.next()}`, resourceMap: {} };
  }

  uploadFile() {
    let { appContext, multiple, maxSize } = this.props;
    if(!maxSize) maxSize = 1024 * 10;
    let { id, resourceMap } = this.state;
    if (multiple === false) {
      resourceMap = {}
    }
    let input: any = document.querySelector(`input[name="file${id}"]`)
    if (!input) return;

    let data = new FormData()
    for (let i = 0; i < input.files.length; i++) {
      let file = input.files[i];
      if(file.size > maxSize) {
        let msg = `File ${file.name} is too big. The max file size is ${maxSize}MB`;
        widget.layout.showNotification('info', 'File Is Too Big', msg);
        return;
      }
      let resource = {
        id: `${file.name}-${file.size}`, type: 'file',
        name: file.name, size: file.size
      };
      data.append('files', file);
      resourceMap[resource.id] = resource;
    }
    let { onUploadSuccess } = this.props;
    let successCB = (result: any) => {
      let uploadResources = result.data;
      onUploadSuccess(uploadResources);
    }
    let restClient = appContext.getServerContext().getRestClient();
    restClient.formSubmit('upload/multi-file', data, successCB);
    this.setState({ resourceMap: resourceMap });
  }

  remove(id: string) {
    let { appContext } = this.props;
    let { resourceMap } = this.state;
    let deleteResource = resourceMap[id];
    delete resourceMap[id];
    let resources = new Array<UploadResource>();
    let { onRemoveSuccess } = this.props;
    for (let propName in resourceMap) {
      resources.push(resourceMap[propName]);
    }
    let successCB = (result: any) => {
      let resource = result.data;
      if (onRemoveSuccess) onRemoveSuccess(resource);
      this.setState({ resourceMap: resourceMap });
    }
    appContext.serverDELETE('upload/resource', deleteResource, successCB);
  }

  render() {
    let { label, multiple } = this.props;
    let { id, resourceMap } = this.state;
    let uploadFileEles = new Array<ReactFragment>();
    let { Button } = reactstrap;
    let { PopoverButton } = widget.element;
    for (let id in resourceMap) {
      let file = resourceMap[id];
      let ele = (
        <div key={id} className='resource'>
          <span>File: {file.name} [{file.size} bytes]</span>
          <Button color='link' className='ml-1' onClick={() => this.remove(id)}>x</Button>
        </div>
      );
      uploadFileEles.push(ele);
    }
    let html = (
      <div className='w-upload-resource'>
        <div className='control'>
          <strong>{label}</strong>
          <PopoverButton
            id={`popover-${id}`} color='link' faIcon={fas.faUpload}
            popover={{ title: 'Upload File', open: false }}>
            <input type='file' name={`file${id}`} multiple={multiple} />
            <Button color='link' className='ml-1' onClick={() => this.uploadFile()}>{'Upload'}</Button>
          </PopoverButton>
        </div>
        {uploadFileEles}
      </div>
    );
    return html;
  }
}
interface WUploadResourceListProps {
  appContext: app.AppContext,
  pageContext: app.PageContext,
  multiple?: boolean,
  rest: server.rest.Rest,
  onUpload: (uploadResources: Array<UploadResource>) => void
}
export class WUploadResourceList extends Component<WUploadResourceListProps> {
  plugin: VGridEntityListPlugin;
  vgridContext: VGridContext;

  constructor(props: WUploadResourceListProps) {
    super(props);
    let config: VGridConfig = {
      record: {
        fields: [
          VGridConfigTool.FIELD_INDEX(),
          ...VGridConfigTool.FIELD_SELECTOR(true),
          { name: 'name', label: 'Name', width: 400 },
          { name: 'size', label: 'Size' }
        ]
      },
      toolbar: {
        actions: [
          {
            name: 'delete', label: 'Del', icon: fas.faTrashAlt,
            onClick: (ctx: VGridContext) => {
              ctx.model.removeSelectedDisplayRecords()
              ctx.getVGrid().forceUpdateView();
            },
          }
        ]
      },
      view: {
        currentViewName: 'table',
        availables: {
          table: {
            viewMode: 'table'
          }
        }
      }

    }
    this.plugin = new VGridEntityListPlugin();
    this.vgridContext = new VGridContext(this, config, this.plugin.getListModel());
  }

  onInputChange(event: any) {
    this.setState({ file: event.target.files });
    let { rest } = this.props;

    let data = new FormData()
    for (let i = 0; i < event.target.files.length; i++) {
      let file = event.target.files[i];
      data.append('files', file);
    }
    let successCB = (result: any) => {
      let uploadResources: Array<UploadResource> = result.data;
      this.plugin.getListModel().update(uploadResources);
      this.forceUpdate();
      this.setState({ resourceMap: uploadResources });
    }
    rest.formSubmit('upload/multi-file', data, successCB);
  }

  onUploadFiles() {
    let { pageContext, onUpload } = this.props;
    let uploadResources = this.plugin.getListModel().getRecords();
    if (uploadResources.length > 0) onUpload(uploadResources);
    pageContext.onBack();
  }

  render() {
    let { Button } = reactstrap;
    let html = (
      <div className='flex-vbox'>
        <VGrid context={this.vgridContext} />
        <div className='flex-hbox-grow-0 justify-content-between'>
          <input style={{ width: 500 }} type='file' name={`uploadFiles[]`} multiple={true} onChange={event => this.onInputChange(event)} />
          <Button className='ml-1' onClick={() => this.onUploadFiles()}>{'Upload'}</Button>
        </div>
      </div>
    );
    return html
  }
}
