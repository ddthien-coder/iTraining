import React, { Component } from "react";
import {
  DragDropContext, Droppable, DropResult
} from 'react-beautiful-dnd';

import { FAButton } from 'components/widget/fa'

import {
  KanbanContextProps, DNDBoardColumnConfigTool, IKanbanBoard
} from './IKabanBoard'
import { KanbanColumn } from './KanbanColumn'

import './stylesheet.scss';

type KabanBoardState = {
  height: number, width: number
}
export class KanbanBoard extends Component<KanbanContextProps, KabanBoardState> implements IKanbanBoard {
  divElement: HTMLElement | null = null;

  constructor(props: KanbanContextProps) {
    super(props);
    let { context } = this.props;
    context.setKanbanBoard(this);

    let config = context.config;
    let items = context.items;
    let columns = config.column.availables;
    for (let j = 0; j < columns.length; j++) {
      let column = columns[j];
      column.items = [];
    }
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      for (let j = 0; j < columns.length; j++) {
        let column = columns[j];
        if (config.item.inColumn(context, column.name, item)) {
          column.items.push(item);
          break;
        }
      }
    }
    this.state = { height: 500, width: 900 }
  }

  componentDidMount() {
    if (this.divElement) {
      const height = this.divElement.clientHeight;
      const width = this.divElement.clientWidth;
      this.setState({ height: height, width: width });
    }
  }

  forceUpdateView(_newViewId: boolean = false) {
    this.forceUpdate();
  }

  onDragEnd = (result: DropResult) => {
    if (result.type == 'item') {
      this.handleDropItem(result);
      this.forceUpdate();
    } else if (result.type == 'column') {
      this.handleDropColumn(result);
    }
  };

  handleDropItem(result: DropResult) {
    if (!result.destination) return;
    const { source, destination } = result;
    const { context } = this.props;
    let sourceColumn = DNDBoardColumnConfigTool.findColumn(context.config, source.droppableId);
    let destColumn = DNDBoardColumnConfigTool.findColumn(context.config, destination.droppableId);
    const sourceItems = sourceColumn.items;
    const [dragItem] = sourceItems.splice(source.index, 1);
    if (source.droppableId !== destination.droppableId) {
      const destItems = destColumn.items;
      destItems.splice(destination.index, 0, dragItem);
    } else {
      sourceItems.splice(destination.index, 0, dragItem);
    }
    context.config.item.onDropItem(context, sourceColumn, destColumn, dragItem);
    this.forceUpdate();
  }

  handleDropColumn(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index == destination.index) return;
    const { context } = this.props;
    let columns = context.config.column.availables
    let srcColumn = columns[source.index];
    if (source.index < destination.index) {
      columns.splice(destination.index + 1, 0, srcColumn);
      columns.splice(source.index, 1);
    } else {
      columns.splice(source.index, 1);
      columns.splice(destination.index, 0, srcColumn);
    }
    for (let i = 0; i < columns.length; i++) {
      columns[i].index = i;
    }
    if (context.config.column.onMoveColumn) {
      context.config.column.onMoveColumn(context, source.index, destination.index);
    }
    this.forceUpdate();
  }

  render() {
    if (!this.divElement) {
      return (<div className='flex-hbox' ref={(ele) => { this.divElement = ele }}>Loading...</div>)
    }
    const { context } = this.props;
    let config = context.config;
    let { width, height } = this.state;

    let uiControl = this.renderControl();
    if (uiControl) width -= 35;

    const columns = config.column.availables;
    if (!config.column.width) config.column.width = 200;
    config.height = height - 5;

    return (
      <div className='ui-dnd-board flex-hbox' ref={(divElement) => { this.divElement = divElement }}>
        {uiControl}
        <div className='dnd-board flex-hbox' style={{ width: width }}>
          <DragDropContext onDragEnd={this.onDragEnd} >
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {provided => (
                <div className='d-flex' {...provided.droppableProps} ref={provided.innerRef}>
                  {columns.map(column => {
                    return (
                      <KanbanColumn key={column.name} context={context} columnConfig={column} />
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }

  renderControl() {
    const { context } = this.props;
    let config = context.config;
    if (!config.actions) return null;
    let actionBtns = [];
    for (let action of config.actions) {
      actionBtns.push(
        <FAButton
          key={action.name} size='md' outline icon={action.icon} hint={action.hint}
          onClick={() => action.onClick(context)} />
      );
    }
    let html = (<div className='control'>{actionBtns}</div>);
    return html;
  }
}