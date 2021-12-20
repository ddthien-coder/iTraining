import React, { Component, ComponentType } from 'react';
import { CSSProperties } from 'react';
import { EditorState } from "draft-js";
import  Editor, {EditorPlugin} from '@draft-js-plugins/editor';
import PluginEditor from '@draft-js-plugins/editor';

import createToolbarPlugin, {
  Separator, ToolbarProps
} from '@draft-js-plugins/static-toolbar';

import {
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
  createBlockStyleButton
} from '@draft-js-plugins/buttons';

import {Validator} from 'components/util/validator'
import {ELEProps, mergeCssClass} from 'components/widget/element'
import {ErrorCollector} from 'components/widget/input'

import { 
  createKeyBindingPlugin, createParagraphPlugin,
  createBreakPlugin, createHighlightPlugin, 
} from './plugins/HighlightPlugin'
import { IDataConverter, NewDataConverter} from './DataConverter'

import './stylesheet.scss'

const keyBindingPlugin = createKeyBindingPlugin();
const paragraphPlugin = createParagraphPlugin();
const highlightPlugin = createHighlightPlugin({});
const breakPlugin = createBreakPlugin();

const UnstyledButton = createBlockStyleButton({blockType: 'unstyled', children: (<b>N</b>)});
const ParagraphButton = createBlockStyleButton({blockType: 'paragraph', children: (<b>P</b>)});

export interface RichEditorProps {
  style?: CSSProperties;
  className?: string;
  initialHtml?: string;
  onLostFocus?: (editor: RichTextEditor) => void;
  onInputChange?: (editor: RichTextEditor) => void;
}
interface RichEditorState {
  editorState: EditorState;
}
export class RichTextEditor extends Component<RichEditorProps, RichEditorState> {
  editor: PluginEditor | null = null;
  dataConverter: IDataConverter = new NewDataConverter();

  plugins?: EditorPlugin[];
  Toolbar: ComponentType<ToolbarProps>;

  constructor(props: RichEditorProps) {
    super(props);

    const staticToolbarPlugin = createToolbarPlugin({
      theme: {
        buttonStyles: {
          buttonWrapper: 'button-wrapper',
          button: 'button',
          active: 'active'
        },
        toolbarStyles: {
          toolbar: 'draft-js-toolbar'
        }
      }
    });

    this.Toolbar = staticToolbarPlugin.Toolbar;
    this.plugins = [staticToolbarPlugin, keyBindingPlugin, paragraphPlugin, breakPlugin, highlightPlugin]

    let {initialHtml} = props;
    if(!initialHtml) initialHtml = '<p></p>' ;
    this.state = {
      editorState: this.fromHtml(initialHtml)
    }
  }

  onFocus = () => {
    if(this.editor) this.editor.focus();
  };

  onLostFocus = () => {
    let {onLostFocus} = this.props;
    if(onLostFocus) onLostFocus(this);
  };

  onChange = (editorState: EditorState) => {
    this.setState({ editorState });
    let { onInputChange } = this.props;
    if(onInputChange) onInputChange(this);
  }

  toHtml() {
    return this.dataConverter.toHtml(this.state.editorState);
  }

  toPlainText() {
    return this.dataConverter.toPlainText(this.state.editorState);
  }

  fromHtml(html: string) {
    return this.dataConverter.fromHtml(html);
  }

  render() {
    let { className, style } = this.props;
    let Toolbar = this.Toolbar;
    let mergedClass = mergeCssClass('draft-js-editor', className);
    return (
      <div className={mergedClass} style={style} onClick={this.onFocus} onBlur={this.onLostFocus}>
        <Toolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <>
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <HeadlineThreeButton {...externalProps} />
                <Separator className='separator' />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps}/> 
                <ParagraphButton {...externalProps}/> 
                <UnstyledButton {...externalProps}/> 
                <Separator className='separator' />
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
              </>
            )
          }
        </Toolbar>
        <Editor
          ref={(element) => { this.editor = element; }}
          editorState={this.state.editorState}
          onChange={this.onChange} plugins={this.plugins} />
      </div>
    );
  }
}

export interface BBRichTextEditorProps extends ELEProps {
  style?: CSSProperties;
  className?: string;
  bean: any;
  field: string;
  disable?: boolean;
  required?: boolean
  validators?: Array<Validator>;
  errorCollector?: ErrorCollector;
  onInputChange?: (bean: any, field: string, oldVal: any, newVal: any) => void;
};
export interface BBRichTextEditorState {
  bean: any;
}
export class BBRichTextEditor extends Component<BBRichTextEditorProps, BBRichTextEditorState> {
  state: BBRichTextEditorState = { bean: null }

  static getDerivedStateFromProps(props: BBRichTextEditorProps, state: BBRichTextEditorState) {
    let { bean, field, required, errorCollector } = props;
    if (state.bean !== bean) {
      state.bean = bean ;
      let value = bean[field];
      if (required && (!value || value === '')) {
        let errorMessage = 'This field cannot be empty';
        if (errorCollector) errorCollector.collect(field, errorMessage);
      }
      return null;
    }
    return state;
  }

  onInputChange = (editor: RichTextEditor) => {
    let { onInputChange, bean, field } = this.props;
    if (onInputChange) {
      let initialHtml = bean[field];
      onInputChange(bean, field, initialHtml, editor.toHtml());
    }
  }

  onLostFocus = (editor: RichTextEditor) => {
    let {bean, field, validators, errorCollector, required} = this.props;
    let error = false;
    if(validators || required) {
      if(errorCollector) errorCollector.remove(field);
      let text = editor.toPlainText();
      text = text.trim();
      if(required && text === '') {
        if (errorCollector) {
          let message = 'This field cannot be empty';
          errorCollector.collect(field, message);
        }
        error = true;
      }
      if(validators) {
        for(let validator of validators) {
          try {
            validator.validate(text);
          } catch(err) {
            let errorMessage = err.message;
            if (errorCollector) errorCollector.collect(field, errorMessage);
            error = true;
          }
        }
      }
    }
    if(error) return;
    bean[field] = editor.toHtml();
  }

  render() {
    let {bean, field, className, style } = this.props;
    let initialHtml = bean[field];
    let html = (
      <RichTextEditor className={className} style={style} 
        initialHtml={initialHtml} onLostFocus={this.onLostFocus} onInputChange={this.onInputChange}/>
    );
    return html;
  }
}