import { i18n, app, widget, util, React } from 'components'

import { HostAppContext } from './HostAppContext'

const T = i18n.getT([]);

type ICompanyAclModel = app.host.ICompanyAclModel;
const session = app.host.session;

interface WebosProps { webosContext: HostAppContext; }
class CompanyAclNode {
  companyAcl: ICompanyAclModel;
  children: Array<CompanyAclNode> | null = null;

  constructor(companyAcl: ICompanyAclModel) {
    this.companyAcl = companyAcl;
  }

  addChild(node: CompanyAclNode) {
    if (this.children == null) this.children = new Array<CompanyAclNode>();
    this.children.push(node);
  }
}

function build(companyAcls: Array<ICompanyAclModel>) {
  let map: Record<string, CompanyAclNode> = {};
  let nodes = new Array<CompanyAclNode>();
  let roots = new Array<CompanyAclNode>();
  for (let i = 0; i < companyAcls.length; i++) {
    let companyAcl = companyAcls[i];
    let node = new CompanyAclNode(companyAcl);
    nodes.push(node);
    map[companyAcl.companyId] = node;
  }
  for (let node of nodes) {
    if (node.companyAcl.companyParentId == null) {
      roots.push(node);
    } else {
      let parent: CompanyAclNode = map[node.companyAcl.companyParentId];
      if (parent == null) {
        roots.push(node);
      } else {
        parent.addChild(node);
      }
    }
  }
  return roots;
}

export class CompanySelector extends React.Component<WebosProps> {
  onInputChange = (_bean: any, _field: string, _oldVal: any, newVal: any) => {
    let { webosContext } = this.props;
    let callbackHandler = (result: any) => {
      let companyAclModel: ICompanyAclModel = result.data;
      if (companyAclModel != null) {
        session.getAccountAcl().changeCompanyAcl(companyAclModel);
      }
      let osContext = webosContext.osContext;
      osContext.broadcast(new app.OSEvent('Banner', 'webos:change:company', {}, osContext));
    };
    let restClient = webosContext.osContext.getServerContext().getRestClient();
    let currentCompanyCtx = session.getCompanyContextByName(newVal);
    restClient.post("/company/acl/change", currentCompanyCtx, callbackHandler);
  }

  buildOptAndLabels(opts: Array<string>, labels: Array<React.ReactFragment>, node: CompanyAclNode, deep: number) {
    let code = node.companyAcl.companyCode;
    let label = util.text.formater.truncate(node.companyAcl.companyLabel, 25);
    opts.push(code);
    let selectorUI = (
      <span className='d-inline-block' style={{ paddingLeft: 10 * deep }}>{label}[{code}]</span>
    );
    labels.push(selectorUI);
    if (node.children) {
      for (let child of node.children) {
        this.buildOptAndLabels(opts, labels, child, deep + 1);
      }
    }
  }

  render() {
    let companyAcl = session.getAccountAcl().getCompanyAcl();
    let companyAcls = session.getAccountAcl().getAvailableCompanyAcls();

    let selectorUI = null;
    if (!companyAcls || !companyAcl) {
      selectorUI = (<div className='p-2'>No Company Avaliable</div>);
    } else {
      let { BBRadioInputField } = widget.input;
      let companyAclNodes = build(companyAcls);
      let bean = { select: companyAcl.companyCode };
      let opts = new Array<string>();
      let optLabels = new Array<React.ReactFragment>();
      for (let node of companyAclNodes) {
        this.buildOptAndLabels(opts, optLabels, node, 0);
      }
      selectorUI = (
        <BBRadioInputField style={{ display: 'block', padding: '5px 10px' }}
          bean={bean} field={'select'} options={opts} optionLabels={optLabels} onInputChange={this.onInputChange} />
      );
    }

    let html = (
      <div className='p-1'>
        <h6 className='border-bottom'>{T('Companies')}</h6>
        {selectorUI}
      </div>
    );
    return html;
  }
}

export class LanguageSelector extends React.Component<WebosProps> {
  onInputChange = (_bean: any, _field: string, _oldVal: any, newVal: any) => {
    let { webosContext } = this.props;
    let osContext = webosContext.osContext;
    i18n.changeLanguage(newVal);
    osContext.broadcast(new app.OSEvent('Banner', 'webos:change:language', {}, osContext));
  }

  render() {
    let { BBRadioInputField } = widget.input;
    let opts = ['en', 'vn'];
    let optLabels = ['English', 'Vietnamese'];
    let bean = { select: i18n.getLanguage() };

    let html = (
      <div className='p-1'>
        <h6 className='border-bottom'>Languages</h6>
        <BBRadioInputField style={{ display: 'block', padding: '5px 10px' }}
          bean={bean} field={'select'} options={opts} optionLabels={optLabels} onInputChange={this.onInputChange} />
      </div>
    );
    return html;
  }
}