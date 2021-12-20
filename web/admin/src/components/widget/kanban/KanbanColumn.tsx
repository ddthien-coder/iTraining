import React, { Component } from "react";
import { VariableSizeGrid as VList } from "react-window";

import {
  Draggable, Droppable,
  DraggableProvided, DraggableStateSnapshot, DroppableProvided,
  DroppableStateSnapshot, DraggableRubric
} from 'react-beautiful-dnd';

import { fas, FAButton } from 'components/widget/fa'
import { KanbanContextProps, KanbanBoardColumnConfig } from './IKabanBoard'
import { DNDItem } from './DNDItem'

type CellParam = { columnIndex: number, rowIndex: number, style: any };

function ExpandColumnHeaderActions(uiColumn: KanbanColumn) {
  let { context, columnConfig } = uiColumn.props;
  let config = context.config;
  let actionEles = [];
  const ICON_SIZE = 'sm';
  if (config.column.actions) {
    for (let action of config.column.actions) {
      actionEles.push(
        <FAButton key={action.name}
          icon={action.icon} iconSize={ICON_SIZE} color='link' hint={action.hint}
          onClick={() => action.onClick(context, columnConfig)} />
      );
    }
  }
  let html = (
    <div className='actions'>
      <FAButton
        icon={fas.faEye} iconSize={ICON_SIZE} color='link' hint={'Collapse'}
        onClick={uiColumn.onToggleCollapse} />
      {actionEles}
    </div>
  );
  return html;
}

function ExpandColumn(uiColumn: KanbanColumn, height: number, provided: DraggableProvided) {
  let { context, columnConfig } = uiColumn.props;
  let config = context.config;
  height = height - 35;
  let columnWidth = columnConfig.minWidth ? columnConfig.minWidth : config.column.width;
  let items = columnConfig.items;
  let itemHeight = config.item.height;
  let rowCount = items.length;
  let scrollW = rowCount * itemHeight > height ? 7 : 2;
  let html = (
    <div className='column' key={columnConfig.name}
      ref={provided.innerRef} {...provided.draggableProps}
      style={{ userSelect: "none", ...provided.draggableProps.style }}>
      <div className='header'>
        <h3 {...provided.dragHandleProps}>{columnConfig.label}</h3>
        {ExpandColumnHeaderActions(uiColumn)}
      </div>
      <Droppable droppableId={columnConfig.name} mode="virtual"
        renderClone={uiColumn.renderClone} type='item'>
        {(droppableProvided: DroppableProvided, snapshot: DroppableStateSnapshot) => {
          let className = snapshot.isDraggingOver ? 'list-body list-body-hightlight' : 'list-body';
          return (
            <VList
              outerRef={droppableProvided.innerRef}
              style={{ overflowY: "auto" }} className={className}
              columnCount={1} columnWidth={(_index) => columnWidth}
              rowCount={rowCount} rowHeight={(_index) => itemHeight}
              height={height} width={columnWidth + scrollW}>
              {uiColumn.RowData}
            </VList>
          );
        }}
      </Droppable>
    </div>
  );
  return html;
}

function CollapseColumn(uiColumn: KanbanColumn, height: number, provided: DraggableProvided) {
  let { columnConfig } = uiColumn.props;
  let html = (
    <div
      className='column column-collapse border'
      style={{ ...provided.draggableProps.style, height: height }}
      ref={provided.innerRef} {...provided.draggableProps}>
      <div {...provided.dragHandleProps} onClick={uiColumn.onToggleCollapse}>
        {columnConfig.label}
      </div>
    </div>
  );
  return html;
}

interface KanbanColumnProps extends KanbanContextProps {
  columnConfig: KanbanBoardColumnConfig;
}

type KanbanColumnState = {}
export class KanbanColumn extends Component<KanbanColumnProps, KanbanColumnState> {
  RowData = (param: CellParam) => {
    const { context, columnConfig } = this.props;
    let rowIndex = param.rowIndex;
    let items = columnConfig.items;
    let item = items[rowIndex];
    let key = `cell-${rowIndex}`
    return (
      <div key={key} className='flex-vbox' style={{ ...param.style, padding: '2px 5px' }}>
        <DNDItem
          key={key} context={context} columnConfig={columnConfig} item={item} index={rowIndex} />
      </div>
    );
  };

  renderClone = (provided: DraggableProvided, _snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => {
    let { context, columnConfig } = this.props;
    let items = columnConfig.items;
    let item = items[rubric.source.index];
    let html = (
      <div {...provided.draggableProps} {...provided.dragHandleProps}>
        <div className='border' style={{}}>
          <div>
            {context.config.item.renderItem(context, columnConfig, item)}
          </div>
          {context.config.item.renderItemDetail(context, columnConfig, item)}
        </div>
      </div>
    );
    return html;
  }

  onToggleCollapse = () => {
    let { context, columnConfig } = this.props;
    columnConfig.collapse = !columnConfig.collapse;
    context.getKanbanBoard().forceUpdateView();
  }

  shouldComponentUpdate(_nextProps: KanbanColumnProps, _nextState: any) {
    return true;
  }

  render() {
    let { context, columnConfig } = this.props;
    let config = context.config;
    let height = 500;
    if (config.height) height = config.height;
    let html = (
      <Draggable key={columnConfig.name} draggableId={columnConfig.name} index={columnConfig.index} >
        {(provided, _snapshot) => {
          if (columnConfig.collapse) {
            return CollapseColumn(this, height, provided);
          }
          return ExpandColumn(this, height, provided);
        }}
      </Draggable>
    );
    return html;
  }
}