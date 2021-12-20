import React from "react";
import { Component } from "react";

import { FormContainer, FormGroup, ColFormGroup, Row } from 'components/widget/input'
import { VSplit, VSplitPane } from 'components/widget/component'

import {
  BBStringField, BBStringArrayField, BBTextField,
  BBIntField, BBIntArrayField,
  BBLongField,
  BBFloatField,
  BBDoubleField, BBDoubleArrayField,
  BBNumberField,
  BBRadioInputField,
  BBDateTimeField,
  BBSelectField,
  BBBeanSelectField,
  BBCheckboxField,
  BBColorPicker
} from "components/widget/input";

import { BBAutoComplete2, BBOptionAutoComplete } from "components/widget/input/autocomplete";
import { BBRichTextEditor } from "components/widget/draftjs/Editor";

import { PERSONS, PersonBBAutoCompletePlugin } from './Person';

const BEAN = {
  string: 'a string',
  stringArray: ['string 1', 'string 2'],
  text: 'this is a sample text',
  richText: '<h1>header 1</h1>',
  integer: 12,
  integerArray: [1, 2],
  long: 1000,
  float: 1.23,
  double: 10.234,
  number: 10.2345678,
  doubleArray: [1.0, 2.0],
  select: 'male', numSelect: 3,
  dropdownSelect: 'female',
  numDropdownSelect: 3,
  checkbox: 'test',
  itemSelect: 'vn',
  primitiveAutoComplete: 'option 2',
  beanAutoComplete: 'tuan',
  beanAutoComplete2: { name: 'tuan', fullName: 'Tuan Nguyen' },
  datetime: '5/4/2018@14:00:00',
  renderUpdate: 0,
  cron: '',
  color: 'Wheat'
}

interface UIBeanInfoProps { bean: any }
class UIBeanInfo extends Component<UIBeanInfoProps, {}> {
  render() {
    let { bean } = this.props;
    var html = (
      <div style={{ flexGrow: 'initial', width: 400, paddingLeft: 15 }}>
        <pre>{JSON.stringify(bean, null, '  ')}</pre>
      </div>
    );
    return html;
  };
}

interface UIBeanEditorState { renderUpdate: number, disable: boolean, bean: any }
export default class UIBeanEditor extends Component<{}, UIBeanEditorState> {
  state: UIBeanEditorState = { renderUpdate: 0, disable: false, bean: BEAN };

  constructor(props: any) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.autoCompleteOnInputChange = this.autoCompleteOnInputChange.bind(this);
  }

  onInputChange(_bean: any, _field: string, _oldVal: any, _newVal: any) {
    let update = this.state.renderUpdate + 1;
    this.setState({ renderUpdate: update });
  }

  autoCompleteOnInputChange(_bean: any, _field: string, _selectOpt: any, _oldVal: any, _newVal: any) {
    let update = this.state.renderUpdate + 1;
    this.setState({ renderUpdate: update });
  }

  render() {
    let { bean, disable } = this.state;
    let onInputChange = this.onInputChange;

    let selectOpts = ['male', 'female', 'none', 'undefined'];
    let numSelectOpts = [1, 2, 3, 4, 5];
    let languageItems = [
      { language: 'vn', label: "Viet nam" },
      { language: 'en', label: "English" }
    ];

    let primitiveAutoComOpts = [
      'option 1', 'option 2', 'option 3', 'option 4', 'option 5'
    ]
    var html = (
      <VSplit>
        <VSplitPane width={600}>
          <h4>Bean Editor Sample</h4>
          <FormContainer fluid>
            <Row>
              <ColFormGroup type='md' span={6}>
                <label>String:</label>
                <BBStringField bean={bean} field={'string'} disable={disable} onInputChange={onInputChange} />
              </ColFormGroup>

              <ColFormGroup type='md' span={6}>
                <label>String Array</label>
                <BBStringArrayField bean={bean} field={'stringArray'} disable={disable} onInputChange={onInputChange} />
              </ColFormGroup>
            </Row>

            <Row>
              <ColFormGroup type='md' span={12}>
                <FormGroup>
                  <label>Text</label>
                  <BBTextField bean={bean} field={'text'} disable={disable} onInputChange={onInputChange} />
                </FormGroup>
              </ColFormGroup>
            </Row>

            <Row>
              <ColFormGroup type='md' span={12}>
                <FormGroup>
                  <label>Rich Text</label>
                  <BBRichTextEditor bean={bean} field={'richText'} disable={disable} onInputChange={onInputChange} />
                </FormGroup>
              </ColFormGroup>
            </Row>

            <Row>
              <ColFormGroup type='md' span={6}>
                <FormGroup>
                  <label>Integer</label>
                  <BBIntField bean={bean} field={'integer'} disable={disable} onInputChange={onInputChange} />
                </FormGroup>
              </ColFormGroup>

              <ColFormGroup type='md' span={6}>
                <FormGroup>
                  <label>Integer Array</label>
                  <BBIntArrayField bean={bean} field={'integerArray'} disable={disable} onInputChange={onInputChange} />
                </FormGroup>
              </ColFormGroup>
            </Row>

            <Row>
              <ColFormGroup type='md' span={12}>
                <FormGroup label={'Long'}>
                  <BBLongField bean={bean} field={'long'} disable={disable} onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Float'}>
                  <BBFloatField bean={bean} field={'float'} disable={disable} onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Double'}>
                  <BBDoubleField bean={bean} field={'double'} disable={disable} onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Double Array'}>
                  <BBDoubleArrayField
                    bean={bean} field={'doubleArray'} disable={disable} onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Number With Precision'}>
                  <BBNumberField bean={bean} field={'number'} precision={10} disable={disable} onInputChange={onInputChange}
                  onRefresh={(_bbField, _bean, _field) => console.log('call refresh')} />
                </FormGroup>

                <FormGroup label={'Number With Max Precision'}>
                  <BBNumberField bean={bean} field={'number'} maxPrecision={4} disable={disable} onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Radio Select'}>
                  <BBRadioInputField
                    bean={bean} field={'select'} options={selectOpts} disable={disable} onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Radio Number Select'}>
                  <BBRadioInputField
                    bean={bean} field={'numSelect'} options={numSelectOpts} disable={disable}
                    onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Date Time'}>
                  <BBDateTimeField
                    bean={bean} field={'datetime'} timeFormat={'HH:mm:ss'} onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Color Picker'}>
                  <BBColorPicker bean={bean} field={'color'} />
                </FormGroup>

                <FormGroup label={'Dropdown Select'}>
                  <BBSelectField bean={bean} field={'dropdownSelect'} options={selectOpts}
                    disable={disable} onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Dropdown Select Number'}>
                  <BBSelectField
                    bean={bean} field={'numDropdownSelect'} options={numSelectOpts} disable={disable}
                    onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Option Autocomplete(Allow User Input)'}>
                  <BBOptionAutoComplete
                    bean={bean} field={'primitiveAutoComplete'} allowUserInput={true} options={primitiveAutoComOpts}
                    onInputChange={this.autoCompleteOnInputChange} />
                </FormGroup>

                <FormGroup label={'Option Autocomplete(Not Allow User Input)'}>
                  <BBOptionAutoComplete
                    bean={bean} field={'beanAutoComplete'} allowUserInput={false} options={PERSONS}
                    searchField='name' searchDescField='fullName'
                    onInputChange={this.autoCompleteOnInputChange} />
                </FormGroup>

                <FormGroup label={'Autocomplete 2'}>
                  <BBAutoComplete2
                    plugin={
                      new PersonBBAutoCompletePlugin().withAllowCreateNew(true)
                    }
                    useSelectBean={false}
                    bean={bean.beanAutoComplete2} field={'name'} searchField={'name'} searchDescField={'fullName'}
                    onPostSelect={() => this.forceUpdate()} />
                </FormGroup>

                <FormGroup label={'Dropdown Item'}>
                  <BBBeanSelectField bean={bean} field={'itemSelect'} options={languageItems}
                    fieldCheck={'language'} fieldLabel={'label'}
                    disable={disable} onInputChange={onInputChange} />
                </FormGroup>

                <FormGroup label={'Check Box'}>
                  <BBCheckboxField bean={bean} field={'checkbox'} value={'test'} label="Test Checkbox" disable={disable} onInputChange={onInputChange} />
                </FormGroup>
              </ColFormGroup>
            </Row>
          </FormContainer>
        </VSplitPane>

        <VSplitPane>
          <UIBeanInfo bean={bean} />
        </VSplitPane>
      </VSplit>
    );
    return html;
  };
}
