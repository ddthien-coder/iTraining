import React, { ReactFragment } from 'react';

import { formater } from "components/util/text";
import { far, fas, FAButton } from 'components/widget/fa'
import { AutoRefreshButton } from 'components/widget/element'
import { showJson } from 'components/widget/layout'
import { ListModel } from 'components/widget/grid/model/ListModel';
import { Event } from 'components/widget/context';
import { KanbanContext, KanbanBoardColumnConfig } from 'components/widget/kanban'
import {
  CalendarContext, CalendarConfig, CalendarViewType, HourCellMode, CellAction
} from 'components/widget/calendar/ICalendar'
import {
  VGridConfig, VGridContext, FieldConfig, VGridGridViewConfig, VGridAggregationViewConfig,
  VGridKabanViewConfig, VGridCalendarViewConfig
} from 'components/widget/grid/IVGrid'
import { VGrid } from 'components/widget/grid/VGrid'
import { CountReportFilter, UICountReportFilter } from 'components/widget/grid/control/filter'
import { RECORD_ADD_HANDLER, RECORD_DEL_SELECTED_HANDLER } from 'components/widget/grid/event'
import {
  AggregationDisplayModel, ValueAggregation, DateValueAggregation, SumAggregationFunction,
  TreeDisplayModelPlugin, DisplayRecord
} from 'components/widget/grid/model'
import {
  createIndex, createSelector, WGridFilter,
  WGridRecordSelector, WGridRowDelete, WGridMarkRowDeleted, WGridInsertRow,
  VGridControlSection, ControlViewMode
} from 'components/widget/grid'

function GridViewConfig() {
  let config: VGridGridViewConfig = {
    viewMode: 'grid',
    renderRecord: function (ctx: VGridContext, dRecord: DisplayRecord) {
      let { record, row } = dRecord;
      let html = (
        <div className='flex-vbox border p-1'>
          <div className='flex-hbox align-items-baseline'>
            <WGridRecordSelector context={ctx} row={row} />
            <div className='p-1'>{record.string}</div>
          </div>
          <div className='flex-vbox'> Cell Content...  </div>
          <div className='flex-hbox justify-content-end'>
            <WGridRowDelete color='link' context={ctx} row={row} />
          </div>
        </div>
      )
      return html;
    }
  };
  return config;
}

function AggregationViewConfig() {
  let config: VGridAggregationViewConfig = {
    viewMode: 'aggregation',
    treeWidth: 200,
    createAggregationModel(_ctx: VGridContext) {
      let model = new AggregationDisplayModel("All", false);
      let typeAggregation =
        new ValueAggregation('Type', 'type', true)
          .withAggFunction(
            new SumAggregationFunction('Sum', ['integer', 'long', 'float', 'saleQuantity', 'saleRevenue']));
      model.addAggregation(typeAggregation);
      let dateAggregation =
        new DateValueAggregation('Date', 'date', 'YYYY-MM-DD');
      model.addAggregation(dateAggregation);
      return model;
    }
  };
  return config;
}

function KanbanViewConfig() {
  let config: VGridKabanViewConfig = {
    viewMode: 'kanban',
    board: {
      item: {
        height: 100,

        inColumn: (_ctx: KanbanContext, name: string, item: any) => {
          return name == item.step;
        },

        onDropItem: (
          _ctx: KanbanContext, sourceCol: KanbanBoardColumnConfig, destCol: KanbanBoardColumnConfig, item: any) => {
          item.state = destCol.name;
          console.log(`Drag Item ${item.string} from ${sourceCol.name} to ${destCol.name}`)
        },

        getItemId: (_ctx: KanbanContext, _item: any, columnName: string, index: number) => {
          return `${columnName}-item-${index}`;
        },

        renderItem: (_ctx: KanbanContext, _col: KanbanBoardColumnConfig, item: any) => {
          return (<h5 className='border-bottom'>{item.string}</h5>);
        },

        renderItemDetail: (_ctx: KanbanContext, _col: KanbanBoardColumnConfig, item: any) => {
          return (<div>{item.string}</div>);
        }
      },

      column: {
        width: 0,
        availables: [
          { name: "step-1", label: 'Step 1', items: [], index: 0 },
          { name: "step-2", label: 'Step 2', items: [], index: 1 },
          { name: "step-3", label: 'Step 3', items: [], index: 2 },
          { name: "step-4", label: 'Step 4', items: [], index: 3 },
          { name: "step-5", label: 'Step 5', items: [], index: 4 },
        ],

      },
    }
  };
  return config;
}

function CalendarViewConfig() {
  let config: VGridCalendarViewConfig = {
    viewMode: 'calendar',
    config: {
      view: CalendarViewType.Year,
      cellAction: CellAction.All,
      cellMode: HourCellMode.All,
      selectedDate: new Date(),
      record: { dateField: 'date' },
      year: {},
      month: {

        renderCell(ctx: CalendarContext, _config: CalendarConfig, date: Date) {
          let dayRecord = ctx.getDateRecordMap().getByDay(date);
          if (!dayRecord) return null;
          let allRecords = dayRecord.getAllRecords();
          if (allRecords.length == 0) return null;
          return <div>{allRecords.map(h => h.string)}</div>;
        }
      },

      week: {
        renderCell(ctx: CalendarContext, config: CalendarConfig, date: Date) {
          let hourRecordMap = ctx.getDateRecordMap().getByDay(date);
          if (!hourRecordMap) return null;
          let hourRecords = hourRecordMap.getRecordAtHour(config, date);
          if (!hourRecords || hourRecords.length == 0) return <></>;
          return (<div>{hourRecords.map(h => h.string)}</div>);
        }
      },
      day: {
        renderCell(ctx: CalendarContext, config: CalendarConfig, date: Date) {
          let hourRecordMap = ctx.getDateRecordMap().getByDay(date);
          if (!hourRecordMap) return null;
          let hourRecords = hourRecordMap.getRecordAtHour(config, date);
          if (!hourRecords || hourRecords.length == 0) return <></>;
          return (<div>{hourRecords.map(h => h.string)}</div>);
        }
      },

      plugin: {
        label: 'PLugin Demo', width: 400
      }
    }
  };
  return config;
}

function createConfig() {
  let CONFIG: VGridConfig = {
    record: {
      editor: {
        supportViewMode: ['table', 'tree']
      },
      fields: [
        createIndex("#", 45, true),
        createSelector("Sel", 30, false),
        {
          name: '_action_', label: 'Actions', width: 75, container: 'fixed-left',
          customRender: (ctx: VGridContext, _field: FieldConfig, record: DisplayRecord) => {
            let create = (_ctx: VGridContext, atRecord: DisplayRecord) => {
              let newRecord = atRecord.cloneRecord();
              newRecord.parentId = atRecord.record.id;
              newRecord.id = null;
              newRecord.left = 'New Record';
              return newRecord;
            }
            let allowInsert = (_ctx: VGridContext, atRecord: DisplayRecord) => {
              let recState = atRecord.getRecordState(false);
              if (!recState) return false;
              if (recState.isMarkNew() || recState.isMarkDeleted()) {
                return false;
              }
              return true;
            }
            let actions: Array<ReactFragment> = [
              <WGridMarkRowDeleted color='link' context={ctx} row={record.row} />,
              <WGridInsertRow color='link' context={ctx} row={record.row}
                createInsertRecord={create} allowInsert={allowInsert} />
            ]
            return actions;
          }
        },
        {
          name: 'left', label: 'Fixed Left', container: 'fixed-left', width: 250,
          sortable: true, removable: false, state: { showRecordState: true },
          editor: { type: 'string', required: true },
          onClick: function (_ctx: VGridContext, record: DisplayRecord) {
            console.log('on click row');
            console.log(record.record);
          }
        },

        {
          name: 'right', label: 'Fixed Right', container: 'fixed-right', width: 150,
          onClick: function (_ctx: VGridContext, record: DisplayRecord) {
            console.log('on click row');
            console.log(record.record);
          }
        },
        {
          name: 'string', label: 'string column', width: 150, editor: { type: 'string' },
          state: { showRecordState: true },
          onClick: function (_ctx: VGridContext, record: DisplayRecord) {
            console.log('on click row');
            console.log(record.record);
          }
        },
        { name: 'type', label: 'Type', sortable: true, editor: { type: 'string', required: true } },
        { name: 'integer', label: 'Integer', sortable: true, editor: { type: 'int' } },
        { name: 'long', label: 'Long', editor: { type: 'long' } },
        { name: 'float', label: 'Float' },
        { name: 'double', label: 'Double', editor: { type: 'double' } },
        { name: 'boolean', label: 'Boolean' },
        { name: 'saleQuantity', label: 'Sale Qty', format: formater.integer },
        { name: 'saleRevenue', label: 'Sale Revenue', format: formater.currency }
      ],
      fieldGroups: {
        string: {
          label: 'String',
          fields: ['left', 'right', 'type', 'string']
        },
        number: {
          label: 'Number',
          fields: ['integer', 'float', 'double', 'saleQuantity', 'saleRevenue']
        }
      }
    },

    control: {
      label: 'Demo Table',
      sections: [
        {
          name: 'sample', label: "Sample",
          render: (ctx: VGridContext, mode: ControlViewMode) => {
            if (mode == 'expand') {
              let html = (
                <div className='flex-vbox py-2'>
                  <FAButton className='w-100 text-left' size='sm' color='link' icon={fas.faEye}
                    onClick={() => showJson('lg', "Modified Records", ctx.model.getMarkModifiedRecords())}>
                    Modified Records
                  </FAButton>
                  <FAButton className='w-100 text-left' size='sm' color='link' icon={fas.faEye}>Link 2</FAButton>
                </div>
              );
              return html;
            } else {
              return <VGridControlSection context={ctx} mode={'collapse'} />;
            }
          }
        },

        {
          name: 'filters', label: "Filters",
          render: (ctx: VGridContext, mode: ControlViewMode) => {
            let typeFilter = ctx.getAttribute('typeFilter') as CountReportFilter;
            if (!typeFilter) {
              typeFilter = new CountReportFilter("Type Filter", 'type', ctx.model.getRecords());
              ctx.withAttr('typeFilter', typeFilter);
            }
            let stepFilter = ctx.getAttribute('stepFilter') as CountReportFilter;
            if (!stepFilter) {
              stepFilter = new CountReportFilter("Step Filter", 'step', ctx.model.getRecords());
              ctx.withAttr('stepFilter', stepFilter);
            }
            if (mode == 'expand') {
              return (
                <>
                  <UICountReportFilter context={ctx} filter={typeFilter} />
                  <UICountReportFilter context={ctx} filter={stepFilter} />
                </>
              );

            }
            return <></>;
          }
        }
      ]
    },

    toolbar: {
      actions: [
        {
          name: 'add', label: 'Add', icon: fas.faPlus,
          onClick: function (context: VGridContext) {
            let record = { string: 'string new row', type: 'add', date: new Date() }
            RECORD_ADD_HANDLER.handle(context, context.uiRoot, new Event().withParam('records', [record]));
          }
        },
        {
          name: 'delete', label: 'Del', icon: far.faTrashAlt,
          onClick: function (context: VGridContext) {
            RECORD_DEL_SELECTED_HANDLER.handle(context, context.uiRoot, new Event());
          }
        }
      ],
      filters: [
        {
          name: 'filter', hint: 'Filter', icon: fas.faFilter,
          createComponent: function (context: VGridContext) {
            return (<WGridFilter context={context} />);
          }
        },
      ],
      filterActions: [
        {
          name: 'autorefresh', label: '',
          createComponent: function (_ctx: VGridContext) {
            return (
              <div className='flex-hbox'>
                <AutoRefreshButton
                  color='secondary' id={'test-auto-refresh'} label={'Go'}
                  defaultPeriod={-1} onRefresh={() => console.log('refresh')} />
              </div>
            );
          }
        }
      ]
    },
    footer: {
      default: {
        render: (_ctx: VGridContext) => {
          return (<div style={{ height: 30 }}>Footer</div>);
        }
      }
    },

    view: {
      currentViewName: 'table',
      availables: {
        table: {
          viewMode: 'table',
          footer: {
            createRecords: (_ctx: VGridContext) => {
              let records = new Array<any>();
              records.push({ left: 'left footer', right: 'right footer' })
              return records;
            },

            customRender: (_ctx: VGridContext, _field: FieldConfig, _record: DisplayRecord) => {
              return <div>OK</div>
            }
          }
        },

        grid: GridViewConfig(),

        aggregation: AggregationViewConfig(),
        print: {
          viewMode: 'print',
          currentPrintName: 'activities',
          prints: [
            { name: 'activities', label: 'Activities' },
            { name: 'progresses', label: 'Progresses' }
          ]
        },
        tree1: {
          viewMode: 'tree',
          label: 'Tree 1',
          icon: fas.faTree,
          treeField: 'left',
          plugin: new TreeDisplayModelPlugin()
        },

        tree2: {
          viewMode: 'tree',
          label: 'Tree 2',
          treeField: 'left',
          plugin: new TreeDisplayModelPlugin()
        },

        kanban: KanbanViewConfig(),

        calendar: CalendarViewConfig()
      }
    }
  }
  return CONFIG;
}

const SIZE = 200, PARENT_ID_SIZE = 7;
const records: Array<any> = [];
for (let i = 0; i < SIZE; i++) {
  let date = new Date();
  date.setDate(date.getDate() + (i % 3));
  let type = 'type-' + (i % 5);
  let randQty = Math.floor(Math.random() * 100);
  let step = i % 5 + 1;
  let parentId = null;
  if (i >= PARENT_ID_SIZE) {
    parentId = Math.floor(i / PARENT_ID_SIZE) + i % PARENT_ID_SIZE;
  }
  let record = {
    id: i,
    parentId: parentId,
    left: 'fixed-left: row = ' + i,
    right: 'fixed-right: row = ' + i,
    step: 'step-' + step,
    string: 'string: row = ' + i,
    type: type,
    date: date,
    integer: 123, long: 123, float: 1.23, double: 1.234, boolean: true,
    saleQuantity: randQty,
    saleRevenue: randQty * 50000
  };
  records.push(record);
}

export class VGridDemo extends React.Component<{}, {}> {
  render() {
    let model = new ListModel(records);
    let ctx = new VGridContext(this, createConfig(), model);
    let html = (<VGrid context={ctx} />);
    return html;
  }
}