import React from "react";
import { Component } from "react";

import * as server from 'components/server/index'
import * as app from 'components/app/index'
import * as reactstrap from 'reactstrap'

import { VSplit, VSplitPane } from 'components/widget/component'

import { UIBootstrapDemo } from 'components/sample/widget/UIBootstrapDemo'
import { UIElementDemo } from 'components/sample/widget/UIElement'
import UIBeanEditor from './widget/input/UIBeanEditor'

import UIVTreeDemo from 'components/sample/widget/list/UIVTreeDemo'

import { UIGraphicDemo } from 'components/sample/widget/graphic/UIGraphicDemo'

import { UICalendarManagerDemo } from "components/sample/widget/calendar/UICalendarManagerDemo";

import { UIBarChartDemo } from "components/sample/widget/chart/UIBarChartDemo";
import { UIPieChartDemo } from "components/sample/widget/chart/UIPieChartDemo";
import { UIAreaChartDemo } from "components/sample/widget/chart/UIAreaChartDemo";
import { UILineChartDemo } from "components/sample/widget/chart/UILineChartDemo";
import { UIComboChartDemo } from "components/sample/widget/chart/UIComboChartDemo";

import { SimpleMentionEditor } from "components/sample/widget/draftjs/DraftJSPLuginTest";
import { RichTextEditor } from "components/widget/draftjs/Editor";

import { GridExample } from "components/widget/grid/Example";
import { VGridDemo } from "components/sample/widget/grid/VGridDemo";

const DEFAULT_CATEGORY = 'widget';
const DEFAULT_VIEW = 'bean-editor';

const DEMO_COMPONENTS: any = {
  'widget': {
    'label': 'Widget',
    'components': {
      'element': {
        'label': "Element", 'description': "Basic Element Demo",
        'view': (<UIElementDemo />)
      },
      'reactstrap': {
        'label': "Reactstrap", 'description': "Reactstrap(Bootstrap) Demo",
        'view': (<UIBootstrapDemo />)
      },
      'bean-editor': {
        'label': "Bean Editor", 'description': "Demo Bean Editor",
        'view': (<UIBeanEditor />)
      },
      'draft-plugins': {
        'label': "Draft JS With Plugin", 'description': "Draft JS With Plugin",
        'view': (<SimpleMentionEditor />)
      },
      'draftjs-editor': {
        'label': "Draft JS Editor", 'description': "Draft JS Editor",
        'view': (<RichTextEditor/>)
      }
    },
  },

  'graphic': {
    'label': 'Graphic',
    'components': {
      'UIGraphicDemo': {
        'label': "Graphic Demo",
        'description': "Graphic Demo",
        'view': (<UIGraphicDemo />)
      },
      'Calendar': {
        'label': "Calendar",
        'description': "Calendar Demo",
        'view': (<UICalendarManagerDemo />)
      }
    }
  },

  'chart': {
    'label': 'Charts',
    'components': {
      'area-chart': {
        'label': "Area Chart",
        'description': "Area Chart Demo",
        'view': (<UIAreaChartDemo />)
      },
      'pie-chart': {
        'label': "Pie Chart",
        'description': "Pie Chart Demo",
        'view': (<UIPieChartDemo />)
      },
      'bar-chart': {
        'label': "Bar Chart",
        'description': "Bar Chart Demo",
        'view': (<UIBarChartDemo />)
      },
      'line-chart': {
        'label': "Line Chart",
        'description': "Line Chart Demo",
        'view': (<UILineChartDemo />)
      },
      'combo-chart': {
        'label': "Combo Chart",
        'description': "Combo Chart Demo",
        'view': (<UIComboChartDemo />)
      }
    }
  },

  'grid': {
    'label': 'Virtual Grid',
    'components': {
      'grid-example': {
        'label': "Grid Example",
        'description': "React Window Example",
        'view': (<GridExample />)
      },
      'vgrid': {
        'label': "VGrid Demo",
        'description': "Demo Grid Table",
        'view': (<VGridDemo />)
      },
    }
  },

  'list': {
    'label': 'List',
    'components': {
      'grid-example': {
        'label': "Grid Example",
        'description': "React Window Example",
        'view': (<GridExample />)
      },
      'vtree': {
        'label': "VTree Demo",
        'description': "Demo VTree",
        'view': (<div style={{ height: '600px' }}> <UIVTreeDemo /> </div>)
      }
    }
  },
  'server': {
    'label': 'Server',
    'components': {
      'rest-ping': {
        'label': "Rest Ping",
        'description': "Demo UIRestPing Component",
        'view': (<server.rest.UIRestPing serverUrl={"http://localhost:7080/rest/v1.0.0"} restPath={"/monitor/ping"} />)
      },
      'websocket-ping': {
        'label': "Websocket Echo",
        'description': "Demo UIWebsocketEcho Component",
        'view': (<server.websocket.UIWebsocketEcho serverUrl={"ws://localhost:7080"} wsPath={"/chat"} />)
      },
    }
  },
};

interface NavigationProps {
  appContext: app.AppContext
  event: null | app.AppEvent,
  broadcast: (event: app.AppEvent) => void,
}
export class Navigation extends Component<NavigationProps, {}> {
  render() {
    let { broadcast } = this.props;
    let sections = [];
    for (const categoryName in DEMO_COMPONENTS) {
      let category = DEMO_COMPONENTS[categoryName];
      let items = [];
      for (const name in category.components) {
        let entry = category.components[name];
        let onClickItem = () => {
          let params = { 'category': categoryName, 'component': name };
          broadcast(new app.AppEvent('navigation', 'change-component', params, null));
        };
        let key = categoryName + '/' + name;
        items.push((
          <reactstrap.Button key={key} onClick={onClickItem} size='sm' color='link' className='d-block'>{entry.label}</reactstrap.Button>
        ));
      }
      sections.push((
        <div key={categoryName} className='mb-3'>
          <h5 className='border-bottom'>{category.label}</h5>
          {items}
        </div>
      ));
    }
    return (
      <div className='p-1 mt-2'>
        {sections}
      </div>
    );
  }
}

interface WorkspaceProps {
  appContext: app.AppContext
  event: null | app.AppEvent,
  broadcast: (event: app.AppEvent) => void,
}
export class Workspace extends Component<WorkspaceProps, {}> {
  render() {
    let { event } = this.props;
    let selectDemoComponent = DEMO_COMPONENTS[DEFAULT_CATEGORY].components[DEFAULT_VIEW];
    if (event) {
      let params = event.data;
      selectDemoComponent = DEMO_COMPONENTS[params['category']].components[params['component']];
    }
    return (
      <div className='p-1 full-height-box'>
        <h1>{selectDemoComponent.description}</h1>
        {selectDemoComponent.view}
      </div>
    );
  }
}

interface UISampleProps { appContext: app.AppContext }
export class UISample extends Component<UISampleProps, {}> {
  render() {
    let { appContext } = this.props;
    let broadcast = (event: app.AppEvent) => {
      console.log('App: call broadcast event!!!')
      appContext.setEvent(event);
      this.forceUpdate();
    };
    let event = appContext.consumeEvent();
    let html = (
      <VSplit>
        <VSplitPane width={200}>
          <Navigation appContext={appContext} broadcast={broadcast} event={event} />
        </VSplitPane>
        <VSplitPane>
          <Workspace appContext={appContext} broadcast={broadcast} event={event} />
        </VSplitPane>
      </VSplit>
    );
    return html;
  }
}
