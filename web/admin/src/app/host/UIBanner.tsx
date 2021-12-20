import { NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import { widget, util, reactstrap, app, i18n, React } from 'components'

import  {WAvatar}  from '../../module/account/WAvatar'

import { HostAppContext } from './HostAppContext';
import { UIAppMenu } from './UIAppMenu';
import { CompanySelector, LanguageSelector } from './Selectors';

export interface WebosProps { webosContext: HostAppContext; }

const  T  = i18n.getT([]);
const { IDTracker } = util;
const session = app.host.session; 

const { fas, FAIcon, FAButton } = widget.fa;
const { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } = reactstrap
const { Form, FormGroup, BBStringField } = widget.input;
interface WWSTabControlsState {
  openAddTab?: boolean;
}
class WBannerWSTabControls extends React.Component<WebosProps & RouteComponentProps<{}>, WWSTabControlsState> {
  state = { openAddTab: false };

  toggleAddTab = () => {
    this.setState({ openAddTab: !this.state.openAddTab });
  }

  onRemoveWorkspace(wsId: string) {
    let { webosContext } = this.props;
    let workspaces = webosContext.workspaces;
    workspaces.removeWorkspace(wsId);
    workspaces.save();
    let { history } = this.props;
    let ws = workspaces.getFirstWorkspace();
    history.push(ws.getPath());
  }

  onEnter(_winput: widget.input.WInput, _evt: any, keyCode: number, currInput: any, _model: any) {
    if (keyCode && keyCode === 13) this.createWS(currInput)
  }

  createWS(label: string) {
    let { webosContext } = this.props;
    let workspaces = webosContext.workspaces;
    let ws = workspaces.addNewWorkspace(label);
    workspaces.save();
    let { history } = this.props;
    history.push(ws.getPath());
    this.setState({ openAddTab: false });
  }

  render() {
    let { webosContext } = this.props;
    let workspaces = webosContext.workspaces.getWorkspaces();
    let links = [];
    for (let ws of workspaces) {
      let cssBg = ws.isSelected() ? 'bg-info bg-info-muted' : 'bg-info';
      links.push(
        <div key={ws.getId()} className={`w-tab ${cssBg}`}>
          <NavLink className='text-white' to={ws.getPath()}>{`${ws.getWSLabel()}`}</NavLink>
          <FAButton className='p-0 ml-2 text-white' color='link' icon={fas.faTrashAlt}
            onClick={() => this.onRemoveWorkspace(ws.getId())} />
        </div>
      );
    }
    let tabNameModel = { name: 'WS' }
    let newTab = (
      <div className='w-tab'>
        <UncontrolledDropdown isOpen={this.state.openAddTab} toggle={this.toggleAddTab}>
          <DropdownToggle className='ml-1 p-1 text-white' nav style={{ marginTop: 2 }}>
            <FAIcon icon={fas.faPlus} title={'Add Tab'} />
          </DropdownToggle>
          <DropdownMenu right className='p-1 m-1'>
            <Form style={{ width: 200 }}>
              <FormGroup label={T('Workspace Name')}>
                <BBStringField bean={tabNameModel} field={'name'} focus={true}
                  onKeyDown={
                    (winput: widget.input.WInput, e: any, keyCode: number, currInput: any) => {
                      this.onEnter(winput, e, keyCode, currInput, tabNameModel);
                    }
                  }
                />
              </FormGroup>
            </Form>
            <div className='flex-hbox-grow-0 p-2 justify-content-center'>
              <FAButton color='secondary' icon={fas.faCheck}
                onClick={() => this.createWS(tabNameModel.name)}>OK</FAButton>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
    return (
      <div className='w-tabs flex-hbox-grow-0'>
        {links}
        {newTab}
      </div>
    );
  }
}
const WBannerWSTabControlsWithRouter = withRouter(WBannerWSTabControls);

interface UIMessageNotificationProps { }
interface UIMessageNotificationState { open: boolean; }
class UIMessageNotification extends React.Component<UIMessageNotificationProps, UIMessageNotificationState> {
  state = { open: false }

  toggle = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { Popover, PopoverHeader, PopoverBody } = reactstrap;
    let id = 'webos-messages';
    let html = (
      <div className='flex-hbox mx-1'>
        <FAButton id={id} className='text-white' outline icon={fas.faComment} />
        <Popover placement="bottom" isOpen={this.state.open} target={id} toggle={this.toggle}>
          <PopoverHeader>Devteam</PopoverHeader>
          <PopoverBody>Devteam</PopoverBody>
        </Popover>
      </div>
    );
    return html;
  }
}

interface UIOSNotificationState {
  open: boolean;
}
class UIOSNotification extends React.Component<WebosProps, UIOSNotificationState> {
  renderId: any;
  messages: Array<widget.util.NotificationMessage>;

  constructor(props: any) {
    super(props);
    this.renderId = IDTracker.next();
    this.messages = [
      { label: 'No Message', type: 'info', detail: 'this is no message' },
    ];
    this.state = { open: false }
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { webosContext } = this.props;
    let event = webosContext.osContext.getEvent();
    let open = this.state.open;
    if (event && event.isTarget('os:notification:message')) {
      let msg: widget.util.NotificationMessage = event.data;
      this.messages.unshift(msg);

      webosContext.osContext.consumeEvent();
      this.renderId = IDTracker.next();
      open = true;
      let onTimeout = () => {
        this.setState({ open: false });
      }
      setTimeout(onTimeout, 1500);
    }
    const { Popover, PopoverHeader, PopoverBody } = reactstrap;

    let html = (
      <div className='flex-hbox mx-1'>
        <FAButton id="WebosInfo" className='px-2 text-white' outline icon={fas.faInfo} />
        <Popover placement="bottom" isOpen={open} target="WebosInfo" toggle={() => this.toggle()}>
          <PopoverHeader>Info</PopoverHeader>
          <PopoverBody key={this.renderId} style={{ minWidth: 200 }}>
            {this.renderMessages()}
            <div className='d-flex justify-content-end'>
              <FAButton color='link' size='sm' icon={fas.faList} />
            </div>
          </PopoverBody>
        </Popover>
      </div>
    );
    return html;
  }

  renderMessages() {
    let messages = this.messages;
    let limit = messages.length > 5 ? 5 : messages.length;
    let eles = [];
    for (let i = 0; i < limit; i++) {
      let mesg = messages[i];
      eles.push(<div key={i} className={`alert-${mesg.type} m-1 p-1`}>{mesg.label}</div>);
    }
    return eles;
  }
}

class WBannerAlert extends React.Component<WebosProps, {}> {
  render() {
    const { webosContext } = this.props;
    return (
      <div className='flex-hbox px-1 py-2'>
        <UIOSNotification webosContext={webosContext} />
        <UIMessageNotification />
      </div>
    );
  }
}
class WBannerAdmin extends React.Component<WebosProps & RouteComponentProps, {}> {
  signout() {
    session.signout(this, null);
    let { history } = this.props;
    history.push("/admin/login/app");
  }

  render() {
    let { webosContext } = this.props;
    let accountAcl = session.getAccountAcl();

    let welcome = accountAcl.getFullName();
    let companyAcl = accountAcl.getCompanyAcl();
    if (companyAcl) {
      welcome += `[${companyAcl.companyCode}]`;
    }

    return (
      <div className='w-admin'>
        <WAvatar loginId={accountAcl.getLoginId()} width={25} height={25} borderRadius={12} />
        <UncontrolledDropdown>
          <DropdownToggle className='text-white' nav caret>{welcome}</DropdownToggle>
          <DropdownMenu right>
            <LanguageSelector webosContext={webosContext} />
            <CompanySelector webosContext={webosContext} />
            <DropdownItem divider />
            <DropdownItem onClick={() => this.signout()}>Signout</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  }
}
const WBannerAdminWithRouter = withRouter(WBannerAdmin);

export class UIBanner extends React.Component<WebosProps> {
  render() {
    let { webosContext } = this.props;
    return (
      <div className='ui-banner flex-hbox-grow-0 justify-content-between bg-primary'>
        <div className='flex-hbox-grow-0'>
          <UIAppMenu webosContext={webosContext} />
          <WBannerWSTabControlsWithRouter webosContext={webosContext} />
        </div>
        <div className='flex-hbox-grow-0'>
          <WBannerAlert webosContext={webosContext} />
          <WBannerAdminWithRouter webosContext={webosContext} />
        </div>
      </div>
    );
  }
}