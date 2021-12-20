import React, { Component } from "react";
import { ButtonGroup } from "reactstrap";
import { WidgetContext } from "components/widget/context";
import { FAButton } from "components/widget/fa";
export interface PrintConfig {
  name: string;
  label?: string;
}

export type PrintStatus = 'loading' | 'success' | 'fail';
export type PrintCallback = (status: PrintStatus, loadPrinttUrl: string | null, message?: string) => void;
export type LoadPrint = (
  context: WidgetContext, config: PrintConfig, reportTyp: string, callback: PrintCallback) => void;

interface PrintProps {
  context: WidgetContext;
  defaultPrint?: string;
  reports: Array<PrintConfig>;
  loadPrint?: LoadPrint;
}

interface PrintState {
  printType: 'pdf' | 'xhtml';
  downloadable: boolean;
  currentPrint: string;
  status: PrintStatus;
  viewPrintUrl: string | null;
  message?: string | null;
}

export class UIPrint extends Component<PrintProps, PrintState> {
  state: PrintState;

  constructor(props: PrintProps) {
    super(props);
    let { defaultPrint: defaultReport } = props;
    let report = this.getPrint(defaultReport);
    this.state = {
      printType: 'pdf', downloadable: false, currentPrint: report.name,
      status: 'loading', viewPrintUrl: null, message: null
    };
    this.loadPrint(report, this.state.printType);
  }

  private getPrint(name?: string) {
    let { reports } = this.props;
    let selectReport = null;
    for (let report of reports) {
      if (!selectReport) selectReport = report;
      if (name == report.name) {
        break;
      }
    }
    if (selectReport) return selectReport;
    throw new Error('No Config Found');
  }

  loadPrint(report: PrintConfig, reportType: string) {
    let { context, loadPrint } = this.props;
    if (!loadPrint) {
      alert("No load print available");
      return;
    }
    let callback: PrintCallback = (status: PrintStatus, url: string | null, message?: string) => {
      this.setState({ status: status, viewPrintUrl: url, message: message });
    };
    loadPrint(context, report, reportType, callback);
  }

  onSelectPrintType = (type: 'xhtml' | 'pdf') => {
    this.setState({ printType: type, downloadable: type === 'pdf' });
    let report = this.getPrint(this.state.currentPrint);
    this.loadPrint(report, type);
  }

  onSelectPrint(report: PrintConfig) {
    this.setState({ status: 'loading', currentPrint: report.name, message: null });
    this.loadPrint(report, this.state.printType);
  }

  onDownload = () => {
  }

  renderPrintOptions() {
    let { reports } = this.props;
    let uiButtons = [];
    for (let report of reports) {
      let label = report.label ? report.label : report.name;
      let uiButton = (
        <FAButton color="secondary" disabled={this.state.currentPrint === report.name}
          onClick={() => this.onSelectPrint(report)}>{label}</FAButton>
      );
      uiButtons.push(uiButton);
    }
    return <ButtonGroup className='mx-1'>{uiButtons}</ButtonGroup>
  }

  renderToolbar() {
    let html = (
      <div className='flex-hbox-grow-0 mb-1 py-1 justify-content-between border-bottom bg-dark'>
        {this.renderPrintOptions()}
        <div className='flex-hbox-grow-0'>
          <ButtonGroup className='mx-1'>
            <FAButton color="secondary" disabled={this.state.printType === 'xhtml'}
              onClick={() => this.onSelectPrintType('xhtml')}>Xhtml</FAButton>
            <FAButton color="secondary" disabled={this.state.printType === 'pdf'}
              onClick={() => this.onSelectPrintType('pdf')}>PDF</FAButton>
          </ButtonGroup>
          <FAButton color="secondary" disabled={!this.state.downloadable}
            onClick={this.onDownload}>Download</FAButton>
        </div>
      </div>
    );
    return html;
  }

  renderPrint() {
    let { viewPrintUrl: viewReportUrl } = this.state;
    let uiReport = null;
    if (!viewReportUrl) {
      uiReport = (
        <div className='flex-vbox text-center' style={{ fontSize: '3em', paddingTop: 100 }}>No Report Available</div>
      );
    } else {
      uiReport = (<object className='flex-vbox' data={viewReportUrl} />);
    }
    let html = (
      <div key={`${viewReportUrl}`} className='flex-vbox'>{uiReport}</div>
    );
    return html;
  }

  render() {
    let { status, message } = this.state;
    let html = (
      <div className='flex-vbox'>
        {this.renderToolbar()}
        {this.renderPrint()}
        <div className='flex-hbox-grow-0 justify-content-between border-top p-1 bg-light'>
          <div>{message}</div>
          <div>{status}</div>
        </div>
      </div>
    )
    return html;
  }
}