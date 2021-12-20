import React, { Component } from 'react';

import { FAButton } from 'components/widget/fa';
import type { FAIconDefinition } from 'components/widget/fa';

export interface EventHandler {
  name: string;
  label: string;
  icon?: FAIconDefinition;
  desc?: string;
  requireParam?: Array<string>;
  handle: (ctx: WidgetContext, uiSrc: Component, event: Event) => void;
}

export class Event {
  params: Record<string, any> = {};
  popup: boolean = false;

  isPopupView() { return this.popup; }

  withPopupView() {
    this.popup = true;
    return this;
  }

  getParam(name: string, defaultVal: any = null) {
    if (this.params[name]) return this.params[name];
    return defaultVal;
  }

  withParam(name: string, val: any) {
    this.params[name] = val;
    return this;
  }

  param(name: string) {
    let val = this.params[name];
    if (!val) {
      throw new Error(`Expect event has param ${name}`);
    }
    return val;
  }
}
export class DelayEvent extends Event {
  handler: EventHandler;

  constructor(handler: EventHandler) {
    super();
    this.handler = handler;
  }
}

/**@deprecated */
export const paramOrAttr = (ctx: WidgetContext, event: Event, name: string) => {
  let val = event.getParam(name);
  if (!val) val = ctx.getAttribute(name);
  if (val) return val;
  throw new Error(`Value is for ${name} is not found in event or context`);
}
export class WidgetContext {
  uiRoot: Component;
  attributes: Record<string, any> = {};

  constructor(uiRoot: Component) {
    this.uiRoot = uiRoot;
  }

  attr(name: string, defaultVal: any = null) {
    if (!this.attributes[name]) {
      if (defaultVal) return defaultVal;
      throw new Error(`Expect UIContext has attribute ${name}`);
    }
    return this.attributes[name];
  }

  getAttribute(name: string) {
    return this.attributes[name];
  }

  withAttr(name: string, obj: any) {
    this.attributes[name] = obj;
    return this;
  }

  ensureAttributes(names: Array<string>) {
    for (let name of names) {
      if (!this.attributes[name]) {
        throw new Error(`Expect UIContext has attribute ${name}`);
      }
    }
  }

  broadcast(uiSrc: Component, event: DelayEvent) {
    let handler = event.handler;
    handler.handle(this, uiSrc, event);
  }
}
interface EventButtonProps {
  label?: string;
  icon?: FAIconDefinition;
  event: DelayEvent;
  className?: string;
  style?: any;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  outline?: boolean;
  disabled?: boolean;
  hint?: string;
  hide?: any;
  context: WidgetContext;
}
export class EventButton extends Component<EventButtonProps>{
  render() {
    let { context, label, icon, event, className, style, color, size, outline, disabled, hide, hint } = this.props;
    if (hide) return null;
    if (label == undefined) label = event.handler.label;
    if (icon == undefined) icon = event.handler.icon;
    let html = (
      <FAButton className={className} style={style} outline={outline} disabled={disabled} hint={hint}
        size={size} color={color} icon={icon} onClick={() => context.broadcast(this, event)}>
        {label}
      </FAButton>
    );
    return html;
  }
}