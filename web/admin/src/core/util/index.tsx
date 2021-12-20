import { widget, util } from 'components'

const { TimeUtil } = util;

export const UUIDTool = {
  generateWithLabel(guideMsg: string, label: string, addTime: boolean) {
    if (!label) {
      widget.layout.showNotification('info', 'Info', guideMsg);
      return "";
    }
    let name = label.replace(/\t|\s|\//g, '-');
    if (addTime) {
      name = label + '-' + TimeUtil.toDateTimeIdFormat(new Date());
    }
    return name;
  },

  generateWithToken(guideMsg: string, token: string, addTime: boolean) {
    if (!token) {
      widget.layout.showNotification('info', 'Info', guideMsg);
      return "";
    }
    let name = token;
    if (addTime) {
      name = name + '-' + TimeUtil.toDateTimeIdFormat(new Date());
    }
    return name;
  },

  generateWithTokens(guideMsg: string, token: Array<string>, addTime: boolean) {
    let name = '';
    for (let selToken of token) {
      if (!selToken) {
        widget.layout.showNotification('info', 'Info', guideMsg);
        return "";
      }
      if (name.length > 0) name += '-' + selToken;
      else name = selToken;
    }
    if (!name) {
      widget.layout.showNotification('info', 'Info', guideMsg);
      return "";
    }
    if (addTime) {
      name = name + '-' + TimeUtil.toDateTimeIdFormat(new Date());
    }
    return name;
  },

  generateWithAnyTokens(guideMsg: string, tokens: Array<string>, addTime: boolean) {
    let name = '';
    for (let selToken of tokens) {
      if (!selToken) continue;
      if (name.length > 0) name += '-' + selToken;
      else name = selToken;
    }
    if (!name) {
      widget.layout.showNotification('info', 'Info', guideMsg);
      return "";
    }
    if (addTime) {
      name = name + '-' + TimeUtil.toDateTimeIdFormat(new Date());
    }
    return name;
  },
}

export const EntityTool = {
  isDraftMode(entity: any) {
    return entity.editMode === 'DRAFT';
  },

  ensureValidMode(entity: any, title: string, detail?: string) {
    if (entity.editMode === 'DRAFT') {
      if (!detail) detail = title;
      widget.layout.showNotification('danger', title, 'Entity is still in draft or invalid mode');
      return false;
    }
    return true;
  },
}