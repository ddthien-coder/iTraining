import React, { ReactElement } from 'react';

import { server, util, widget, app } from 'components';
import AvatarEditor from 'react-avatar-editor'

import { WComponent, WComponentProps, WEntity, WEntityProps } from 'core/widget';
import { T, AccountRestURL, WUploadResource, UploadResource } from "./Dependency";

const { FAButton, fas } = widget.fa;
const { BBSlider, FormContainer, Row, ColFormGroup } = widget.input;
 
const CONFIG = app.host.CONFIG;
interface WAvatarImgEditorProps extends WComponentProps {
  avatarUrl: string;
  onSaveAvatar: (image: any) => void;
}
export class WAvatarImgEditor extends WComponent<WAvatarImgEditorProps> {
  editor: any = null;
  bean = { scale: 1.5, border: 50, borderRadius: 15 }

  onInputChange = (_bean: any, _field: string, _oldVal: number, _newVal: number) => {
    this.forceUpdate();
  }

  onSave = () => {
    if (this.editor) {
      let { onSaveAvatar } = this.props;
      const image = this.editor.getImage();
      //const scaledImage = this.editor.getImageScaledToCanvas();
      onSaveAvatar(image);
    }
  }

  setEditorRef = (editor: any) => this.editor = editor

  render() {
    let { avatarUrl } = this.props;
    return (
      <FormContainer fluid>
        <Row>
          <ColFormGroup span={12}>
            <AvatarEditor
              ref={this.setEditorRef}
              crossOrigin={'anonymous'}
              image={avatarUrl}
              width={100} height={100} border={[50, 50]} borderRadius={this.bean.borderRadius}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={this.bean.scale} rotate={0} />
          </ColFormGroup>
        </Row>
        <Row>
          <ColFormGroup span={12} label={'Border Radius'}>
            <BBSlider bean={this.bean} field="borderRadius" min={0} max={50} step={2}
              onInputChange={this.onInputChange} />
          </ColFormGroup>
        </Row>
        <Row>
          <ColFormGroup span={12} label={'Scale'}>
            <BBSlider bean={this.bean} field="scale" min={0} max={2} step={0.1}
              onInputChange={this.onInputChange} />
          </ColFormGroup>
        </Row>
        <Row>
          <ColFormGroup span={12} className='flex-hbox-grow-0 justify-content-end'>
            <FAButton color='primary' size='sm' onClick={() => this.onSave()}>Save</FAButton>
          </ColFormGroup>
        </Row>
      </FormContainer>
    )
  }
}

interface WAvatarEditorProps extends WEntityProps {
}
export class WAvatarEditor extends WEntity<WAvatarEditorProps> {
  mode: 'view' | 'edit' = 'view';
  viewId = util.common.IDTracker.next();

  onUploadSuccess = (resource: UploadResource, modify: boolean) => {
    let { appContext, observer } = this.props;
    let profile = observer.getMutableBean();
    let callback = (response: server.rest.RestResponse) => {
      let resource = response.data;
      profile.avatarUrl = resource.publicDownloadUri;
      this.viewId = util.common.IDTracker.next();
      this.forceUpdate();
    }
    let uploadUrl = null;
    if(modify) uploadUrl = AccountRestURL.profile.modifyAvatar(profile.loginId);
    else       uploadUrl = AccountRestURL.profile.uploadAvatar(profile.loginId);
    appContext.serverPUT(uploadUrl, resource, callback);
  }

  onDeleteUploadResourceSuccess(_resource: any) {
  }

  onSaveAvatar = (image: any) => {
    let { appContext } = this.props;
    this.mode = 'view';
    let thisUI = this;
    image.toBlob(function (blob: any) {
      const formData = new FormData();
      formData.append('files', blob, 'avatar.png');
      let successCB = (result: any) => {
        let uploadResources = result.data;
        let avatarResource = uploadResources[0];
        thisUI.onUploadSuccess(avatarResource, true);
      }
      let restClient = appContext.getServerContext().getRestClient();
      restClient.formSubmit('upload/multi-file', formData, successCB);
    });
  }

  onToggleMode = () => {
    if (this.mode == 'view') this.mode = 'edit';
    else this.mode = 'view';
    this.forceUpdate();
  }

  renderAvatar() {
    let { appContext, pageContext, observer } = this.props;
    let profile = observer.getMutableBean();
    
    if (this.mode == 'view') {
      let avatarUrl = CONFIG.createServerLink(`/get/account-avatar/${profile.loginId}`);
      let html = (
        <div key={this.viewId} className='border m-1 p-1'>
          <img style={{ margin: 'auto', width: 120, height: 120 }} src={avatarUrl} alt="Avatar" />
        </div>
      );
      return html;
    }

    let avatarUrl = CONFIG.createServerLink(`/get/account-avatar/orig/${profile.loginId}`);
    let html = (
      <WAvatarImgEditor
        appContext={appContext} pageContext={pageContext}
        avatarUrl={avatarUrl} onSaveAvatar={this.onSaveAvatar} />
    );
    return html;
  }

  render() {
    let { appContext, pageContext } = this.props;
    let html = (
      <div>
        {this.renderAvatar()}
        <div className='flex-hbox-grow-0'>
          <WUploadResource key={this.viewId}
            appContext={appContext} pageContext={pageContext}
            label={T('Avatar')} multiple={false}
            onUploadSuccess={(uploadResources: any) => this.onUploadSuccess(uploadResources[0], false)}
            onRemoveSuccess={(resource: any) => this.onDeleteUploadResourceSuccess(resource)} />
          <FAButton color='link' icon={fas.faEdit} onClick={this.onToggleMode} />
        </div>
      </div>
    );
    return html;
  }
}

interface WAvatarProps {
  className?: string;
  style?: any;
  loginId: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}
export class WAvatar extends React.Component<WAvatarProps> {
  render() {
    let { className, style, loginId, width, height, borderRadius } = this.props;
    let avatarUrl = CONFIG.createServerLink(`/get/account-avatar/${loginId}`);
    let html = (
      <div key={loginId} className={className} style={style}>
        <img src={avatarUrl} width={width} height={height} style={{ borderRadius: borderRadius }} />
      </div>
    );
    return html;
  }
}

interface WAvatarsProps extends WComponentProps {
  loginIds: Array<string | null | undefined>
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}
export class WAvatars extends WComponent<WAvatarsProps> {
  render() {
    let { loginIds, width, height, borderRadius } = this.props;
    let badges = new Array<ReactElement>();
    for (let loginId of loginIds) {
      if (loginId) {
        badges.push(
          <WAvatar key={loginId} style={{ margin: '1px' }}
            loginId={loginId} width={width} height={height} borderRadius={borderRadius} />
        );
      }
    }
    return <div className='flex-hbox-grow-0'>{badges}</div>;
  }
}