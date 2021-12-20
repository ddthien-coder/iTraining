import React, { Component } from "react";
import { KanbanBoard } from "../../kanban/KabanBoard";
import { VGridViewProps, VGridKabanViewConfig } from "../IVGrid";
import { VGridConfigUtil } from "../util";
import { KanbanContext } from "../../kanban";

export class KanbanView extends Component<VGridViewProps> {
  render() {
    const { context, viewName } = this.props;
    let viewId = context.model.lastModifiedList;
    const kanbanview = VGridConfigUtil.getView(context.config, viewName) as VGridKabanViewConfig;
    let records = context.model.getFilterRecords();
    let kanbanContext = new KanbanContext(context.uiRoot, kanbanview.board, records);
    let html = (<KanbanBoard key={viewId} context={kanbanContext} />);
    return html;
  }
}