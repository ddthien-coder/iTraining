import { Component } from 'react';
import { FAIconDefinition } from 'components/widget/fa';
import { WidgetContext } from '../context';

export enum EventName { 'update' }

export interface KanbanBoardColumnAction {
  name: string;
  icon?: FAIconDefinition;
  hint?: string;
  onClick: (ctx: KanbanContext, colConfig: KanbanBoardColumnConfig) => any
}
export interface KanbanBoardAction {
  name: string;
  icon?: FAIconDefinition;
  hint?: string;
  onClick: (ctx: KanbanContext) => any
}

export interface KanbanBoardColumnConfig {
  index: number;
  name: string;
  label: string;
  minWidth?: number;
  collapse?: boolean;
  items: Array<any>;
  actions?: Array<KanbanBoardColumnAction>;
}

export interface KanbanBoardConfig {
  height?: number;
  actions?: Array<KanbanBoardAction>;

  item: {
    height: number;
    inColumn: (ctx: KanbanContext, name: string, item: any) => boolean;
    onDropItem: (
      ctx: KanbanContext, srcCol: KanbanBoardColumnConfig, descCol: KanbanBoardColumnConfig, item: any) => void;
    getItemId: (ctx: KanbanContext, item: any, columnName: string, index: number) => any;
    renderItem: (ctx: KanbanContext, col: KanbanBoardColumnConfig, item: any) => any;
    renderItemDetail: (ctx: KanbanContext, col: KanbanBoardColumnConfig, item: any) => any;
  }

  column: {
    width: number;
    availables: Array<KanbanBoardColumnConfig>;
    actions?: Array<KanbanBoardColumnAction>;
    onMoveColumn?: (ctx: KanbanContext, sourceIdx: number, destIdx: number) => void;
  }
}

export const DNDBoardColumnConfigTool = {
  findColumn: (config: KanbanBoardConfig, name: string) => {
    const columns = config.column.availables;
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      if (name == column.name) return column;
    }
    throw new Error("Cannot find the column " + name);
  }
}

export interface IKanbanBoard {
  forceUpdateView: (newViewId?: boolean) => void;
}

export class KanbanContext extends WidgetContext {
  config: KanbanBoardConfig;
  items: Array<any>;
  kanbanBoard?: IKanbanBoard;

  constructor(uiRoot: Component, config: KanbanBoardConfig, items: Array<any>) {
    super(uiRoot);
    this.config = config;
    this.items = items;
  }

  getKanbanBoard() {
    if (!this.kanbanBoard) throw new Error("Kanban board is not set");
    return this.kanbanBoard;
  }

  setKanbanBoard(board: IKanbanBoard) {
    this.kanbanBoard = board;
  }
}

export interface KanbanContextProps {
  context: KanbanContext;
}
