import React, { Component } from "react";
import { Draggable } from "react-beautiful-dnd";

import { KanbanBoardColumnConfig, KanbanContextProps } from './IKabanBoard'

interface DNDItemProps extends KanbanContextProps {
  columnConfig: KanbanBoardColumnConfig;
  item: any;
  index: number;
}
type DNDItemState = {}
export class DNDItem extends Component<DNDItemProps, DNDItemState> {
  render() {
    let { context, columnConfig, item, index } = this.props;
    let config = context.config;
    let commonStyle = { padding: 2, margin: "0 0 5px 0", maxHeight: config.item.height - 5 }
    let itemId = config.item.getItemId(context, item, columnConfig.name, index);
    let html = (
      <Draggable key={itemId} draggableId={itemId} index={index} >
        {(provided, _snapshot) => {
          return (
            <div className='dnd-item flex-vbox'
              ref={provided.innerRef} {...provided.draggableProps}
              style={{ ...commonStyle, userSelect: "none", ...provided.draggableProps.style }}>
              <div className='item flex-vbox-grow-0' {...provided.dragHandleProps}>
                {config.item.renderItem(context, columnConfig, item)}
              </div>
              <div className='item-detail flex-vbox' >
                {config.item.renderItemDetail(context, columnConfig, item)}
              </div>
            </div>
          );
        }}
      </Draggable>
    );
    return html;
  }
}