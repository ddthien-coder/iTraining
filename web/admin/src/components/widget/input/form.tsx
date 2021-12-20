import React from "react";
import { Component } from "react";

import { Container } from 'reactstrap';


import { ELEProps, mergeCssClass } from '../element';
import {
  BBFieldProps, BBDateTimeFieldProps,
  BBStringField, BBPasswordField, BBTextField,
  BBNumberField, BBIntField, BBLongField, BBDoubleField, BBCurrencyField,
  BBDateTimeField
} from './bbinput'

import './stylesheet.scss';

export { Container, Row, Form } from 'reactstrap'

export interface FormContainerProps {
  className?: string, fluid?: boolean, children: any, style?: any
};
export class FormContainer extends Component<FormContainerProps> {
  render() {
    let { children, fluid, className, style } = this.props;
    className = mergeCssClass('form', className);
    let html = (
      <Container fluid={fluid} className={className} style={style}>
        {children}
      </Container>
    );
    return html;
  }
}

interface FormGroupProps extends ELEProps {
  label?: string;
  inline?: boolean
};
export class FormGroup extends Component<FormGroupProps> {
  render() {
    let { label, children, style, className, inline } = this.props;
    let allClass = mergeCssClass('form-group', className);
    if (inline) allClass = mergeCssClass(allClass, ' form-group-inline');
    let labelUI = null;
    if (label) labelUI = <label>{label}</label>
    return (
      <div className={allClass} style={style}>
        {labelUI}
        {children}
      </div>
    );
  }
}

function getColClass(type?: string, span?: number) {
  if (!span) span = 12;
  if (type) {
    return `col-${type}-${span}`;
  }
  return `col-${span}`;
}

interface ColProps {
  label?: string;
  children: any, inline?: boolean,
  className?: string,
  style?: any;
  type?: 'sm' | 'md' | 'lg' | 'xl', span: number
};
export class Col extends Component<ColProps> {
  render() {
    let { children, type, span, className, style } = this.props;
    let colClass = getColClass(type, span);
    let html = (
      <div className={mergeCssClass(colClass, className)} style={style}> {children} </div>
    );
    return html;
  }
}

export class ColFormGroup extends Component<ColProps> {
  render() {
    let { label, children, type, span, inline, className, style } = this.props;
    let colClass = getColClass(type, span);
    let html = (
      <div className={colClass} style={style}>
        <FormGroup className={className} label={label} inline={inline}>{children}</FormGroup>
      </div>
    );
    return html;
  }
}

export { ColFormGroup as FormGroupCol };

interface ColBBFieldProps extends BBFieldProps {
  label?: string;
  type?: string;
  span?: number;
}

class ColBBField extends Component<ColBBFieldProps> {
  createBBField(): any {
    throw new Error('You need to return an implement BBField');
  }

  render() {
    let { label, style, className, type, span } = this.props;
    let colClass = getColClass(type, span);
    let allClass = mergeCssClass(`${colClass} form-group`, className);
    let labelUI = null;
    if (label) labelUI = <label>{label}</label>
    return (
      <div className={allClass} style={style}>
        {labelUI}
        {this.createBBField()}
      </div>
    );
  }
}
export class ColBBStringField extends ColBBField {
  createBBField() { return <BBStringField {...this.props} />; }
}

export class ColBBTextField extends ColBBField {
  createBBField() { return <BBTextField {...this.props} />; }
}

export class ColBBPasswordField extends ColBBField {
  createBBField() { return <BBPasswordField {...this.props} />; }
}

export class ColBBNumberField extends ColBBField {
  createBBField() { return <BBNumberField {...this.props} />; }
}

export class ColBBIntField extends ColBBField {
  createBBField() { return <BBIntField {...this.props} />; }
}

export class ColBBLongField extends ColBBField {
  createBBField() { return <BBLongField {...this.props} />; }
}

export class ColBBDoubleField extends ColBBField {
  createBBField() { return <BBDoubleField {...this.props} />; }
}

export class ColBBCurrencyField extends ColBBField {
  createBBField() { return <BBCurrencyField {...this.props} />; }
}

interface ColBBDateTimeFieldProps extends BBDateTimeFieldProps {
  label?: string;
  type?: string;
  span?: number;
}
export class ColBBDateTimeField extends Component<ColBBDateTimeFieldProps> {
  render() {
    let { label, style, className, type, span } = this.props;
    let colClass = getColClass(type, span);
    let allClass = mergeCssClass(`${colClass} form-group`, className);
    let labelUI = null;
    if (label) labelUI = <label>{label}</label>
    return (
      <div className={allClass} style={style}>
        {labelUI}
        <BBDateTimeField {...this.props} />
      </div>
    );
  }
}