import React, { Component } from 'react';

import { FAButton, fas } from 'components/widget/fa';
import { BBAutoComplete2, BBAutoCompletePlugin } from "components/widget/input/autocomplete";

import { Form, FormGroup } from 'components/widget/input'
import { BBStringField } from "components/widget/input";

export const PERSONS = [
  { name: 'thien', fullName: 'Thien Dinh' }
]

export class PersonBBAutoCompletePlugin extends BBAutoCompletePlugin {
  constructor() {
    super();
    this.options = PERSONS;

  }

  onShowMoreInfo(ui: BBAutoComplete2, person: any) {
    if (!person || Object.getOwnPropertyNames(person).length === 0) {
      ui.dialogShow('Person Info', 'md', (<p> {'Choose a person to show more'} </p>));
    } else {
      let uiContent = (<UIPersonForm person={person} readOnly={true} />);
      ui.dialogShow('Person Info', 'md', uiContent);
    }
  }

  onSelectPerson(ui: BBAutoComplete2, selPerson: any) {
    this.replaceWithSelect(ui, selPerson, '');
    ui.dialogClose();
    ui.forceUpdate();
  }

  onCustomSelect(ui: BBAutoComplete2) {
    let uiContent = (
      <div className='d-flex flex-column p-0' style={{ height: '500px' }}>
        TODO:
      </div>
    );
    ui.dialogShow('Select Partner', 'lg', uiContent);
  }

  onCreateNew(ui: BBAutoComplete2) {
    let onPostSave = (person: any) => {
      ui.dialogClose();
      console.log('call onPostSave person');
      console.log(person);
      this.onSelectPerson(ui, person);
    }
    let uiContent = (
      <div className='d-flex flex-column p-0' style={{ height: '500px' }}>
        <UIPersonEditor person={{}} readOnly={false} onPostSave={onPostSave} />
      </div>
    );
    ui.dialogShow('Select Partner', 'lg', uiContent);
  }
}

interface UIPersonFormProps {
  person: any;
  readOnly?: boolean;
}
export class UIPersonForm extends Component<UIPersonFormProps> {
  render() {
    let { person, readOnly } = this.props;
    let html = (
      <Form>
        <FormGroup>
          <label>Name</label>
          <BBStringField bean={person} field={'name'} disable={readOnly} />
        </FormGroup>
        <FormGroup>
          <label>Full Name</label>
          <BBStringField bean={person} field={'fullName'} disable={readOnly} />
        </FormGroup>
      </Form>
    );
    return html;
  }
}

interface UIPersonEditorProps extends UIPersonFormProps {
  onPostSave?: (bean: any) => void;
}
export class UIPersonEditor extends Component<UIPersonEditorProps> {
  onSave(person: any) {
    let { onPostSave } = this.props;
    console.log('save person');
    console.log(person);
    if (onPostSave) onPostSave(person);
  }

  render() {
    let { person, readOnly } = this.props;
    let html = (
      <div className='flex-vbox'>
      <div className='flex-vbox'>
          <UIPersonForm person={person} readOnly={readOnly} />
        </div>
        <div className='d-flex justify-content-end'>
          <FAButton icon={fas.faSave} onClick={() => this.onSave(person)}>Save</FAButton>
        </div>
      </div>
    );
    return html;
  }
}