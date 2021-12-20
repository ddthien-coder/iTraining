import React, { Component } from 'react';

import { FAButton, fas } from "components/widget/fa";
import { ELEProps, mergeCssClass } from "components/widget/element";
import { DialogContext, showDialog } from "components/widget/layout";

const COLOR_GROUPS: Record<string, { groupName: string, colors: Array<string> }> = {
  Pinks: {
    groupName: 'Pinks',
    colors: [
      'Pink', 'LightPink', 'HotPink', 'DeepPink', 'PaleVioletRed', 'MediumVioletRed'
    ]
  },

  Purples: {
    groupName: 'Purples',
    colors: [
      'Lavender', 'Thistle', 'Plum', 'Orchid', 'Violet', 'Fuchsia', 'Magenta',
      'MediumOrchid', 'DarkOrchid', 'DarkViolet', 'BlueViolet', 'DarkMagenta',
      'Purple', 'MediumPurple', 'MediumSlateBlue', 'SlateBlue', 'DarkSlateBlue',
      'RebeccaPurple', 'Indigo'
    ]
  },

  Reds: {
    groupName: 'Reds',
    colors: [
      'LightSalmon', 'Salmon', 'DarkSalmon', 'LightCoral', 'IndianRed',
      'Crimson', 'Red', 'FireBrick', 'DarkRed'
    ]
  },

  Oranges: {
    groupName: 'Oranges',
    colors: [
      'Orange', 'DarkOrange', 'Coral', 'Tomato', 'OrangeRed'
    ]
  },

  Yellows: {
    groupName: 'Yellows',
    colors: [
      'Gold', 'Yellow', 'LightYellow', 'LemonChiffon', 'LightGoldenRodYellow',
      'PapayaWhip', 'Moccasin', 'PeachPuff', 'PaleGoldenRod', 'Khaki', 'DarkKhaki'
    ]
  },

  Greens: {
    groupName: 'Greens',
    colors: [
      'GreenYellow', 'Chartreuse', 'LawnGreen', 'Lime', 'LimeGreen', 'PaleGreen', 'LightGreen',
      'MediumSpringGreen', 'SpringGreen', 'MediumSeaGreen', 'SeaGreen', 'ForestGreen', 'Green',
      'DarkGreen', 'YellowGreen', 'OliveDrab', 'DarkOliveGreen', 'MediumAquaMarine', 'DarkSeaGreen',
      'LightSeaGreen', 'DarkCyan', 'Teal'
    ]
  },

  Cyans: {
    groupName: 'Cyans',
    colors: [
      'Aqua', 'Cyan', 'LightCyan', 'PaleTurquoise', 'Aquamarine', 'Turquoise',
      'MediumTurquoise', 'DarkTurquoise'
    ]
  },

  Blues: {
    groupName: 'Blues',
    colors: [
      'CadetBlue', 'SteelBlue', 'LightSteelBlue', 'LightBlue', 'PowderBlue', 'LightSkyBlue',
      'SkyBlue', 'CornflowerBlue', 'DeepSkyBlue', 'DodgerBlue', 'RoyalBlue', 'Blue',
      'MediumBlue', 'DarkBlue', 'Navy', 'MidnightBlue'
    ]
  },

  Browns: {
    groupName: 'Browns',
    colors: [
      'Cornsilk', 'BlanchedAlmond', 'Bisque', 'NavajoWhite', 'Wheat', 'BurlyWood', 'Tan',
      'RosyBrown', 'SandyBrown', 'GoldenRod', 'DarkGoldenRod', 'Peru', 'Chocolate', 'Olive',
      'SaddleBrown', 'Sienna', 'Brown', 'Maroon'
    ]
  },

  Whites: {
    groupName: 'Whites',
    colors: [
      'White', 'Snow', 'HoneyDew', 'MintCream', 'Azure', 'AliceBlue', 'GhostWhite',
      'WhiteSmoke', 'SeaShell', 'Beige', 'OldLace', 'FloralWhite', 'Ivory', 'AntiqueWhite',
      'Linen', 'LavenderBlush', 'MistyRose'
    ]
  },

  Greys: {
    groupName: 'Greys',
    colors: [
      'Gainsboro', 'LightGray', 'Silver', 'DarkGray', 'DimGray', 'Gray',
      'LightSlateGray', 'SlateGray', 'DarkSlateGray', 'Black'
    ]
  }
}
interface ColorMenuProps {
  onSelect: (color: string) => void;
};
class ColorMenu extends Component<ColorMenuProps> {
  selectGroup = 'Pinks';

  onSelectGroup = (name: string) => {
    this.selectGroup = name;
    this.forceUpdate();
  }

  renderGroupColors() {
    let { onSelect } = this.props;
    let colorLinks = [];
    let group = COLOR_GROUPS[this.selectGroup];
    for (let color of group.colors) {
      colorLinks.push(
        <FAButton style={{ width: '31%', background: color }} className='m-1' onClick={() => onSelect(color)}>
          {color}
        </FAButton>
      );
    }
    return (<div>{colorLinks}</div>);
  }

  renderGroupMenu() {
    let groupLinks = [];
    for (let groupName in COLOR_GROUPS) {
      let group = COLOR_GROUPS[groupName];
      groupLinks.push(
        <FAButton className='text-left' color='link'
          onClick={() => this.onSelectGroup(groupName)}>{group.groupName}</FAButton>
      );
    }
    return (<div className='flex-vbox' style={{ height: 300 }}>{groupLinks}</div>);
  }

  render() {
    let html = (
      <div className='flex-hbox'>
        <div style={{ minWidth: 100, maxWidth: 100 }} className='flex-vbox border-right'>
          {this.renderGroupMenu()}
        </div>
        <div className='flex-vbox pl-1'>
          {this.renderGroupColors()}
        </div>
      </div>
    );
    return html;
  }
}

export interface BBColorPickerProps extends ELEProps {
  bean: any;
  field: string;
  disable?: boolean;
};
export class BBColorPicker<T extends BBColorPickerProps> extends Component<T, {}> {
  dialogContext: DialogContext | null = null;

  onSelect = (color: string) => {
    let { bean, field } = this.props;
    bean[field] = color;
    if (this.dialogContext) {
      this.dialogContext.getDialog().doClose();
      this.dialogContext = null;
    }
    this.forceUpdate();
  }

  showColorPicker() {
    let ui = (<ColorMenu onSelect={this.onSelect} />)
    this.dialogContext = new DialogContext();
    showDialog('Select A Color', 'md', ui, this.dialogContext);
  }

  render() {
    let { className, style, bean, field } = this.props;
    let colorName = bean[field];
    let html = (
      <div className={mergeCssClass(className, 'flex-hbox p-1')} style={style}>
        <div className='flex-hbox pt-1' style={{ background: `${colorName}` }}>{colorName}</div>
        {this.renderControl()}
      </div>
    );
    return html;
  }

  renderControl() {
    const { disable } = this.props;
    if (disable) return null;
    let html = (
      <div className="flex-hbox-grow-0">
        <FAButton color='link' icon={fas.faSearch} onClick={() => this.showColorPicker()} />
      </div>
    );
    return html;
  }
}