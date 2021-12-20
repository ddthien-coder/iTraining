import { CSSProperties, KeyboardEvent } from 'react';

import { RichUtils, getDefaultKeyBinding } from 'draft-js';
import { DraftHandleValue, EditorState, } from "draft-js";
import {PluginFunctions, EditorPlugin, EditorCommand}from '@draft-js-plugins/editor';


const defaultStyle = {
  background: 'blue',
  color: '#fff',
};

const createHighlightPlugin = (customStyle: CSSProperties = {}) => {
  let plugin: EditorPlugin  = {
    customStyleMap: {
      'hightlight': { ...defaultStyle, ...customStyle },
    },

    handleKeyCommand: (command: EditorCommand, editorState: EditorState, _eventTimeStamp: number, pluginFunctions: PluginFunctions): DraftHandleValue => {
      if (command === 'hightlight') {
        pluginFunctions.setEditorState(RichUtils.toggleInlineStyle(editorState, 'hightlight'));
        return 'handled';
      }
      return 'not-handled';
    }
  };
  return plugin;
};

const createParagraphPlugin = (customStyle: CSSProperties = {}) => {
  let plugin: EditorPlugin  = {
    customStyleMap: {
      'paragraph': { ...defaultStyle, ...customStyle },
    },

    handleKeyCommand: (command: EditorCommand, editorState: EditorState, _eventTimeStamp: number, pluginFunctions: PluginFunctions): DraftHandleValue => {
      if (command === 'paragraph') {
        pluginFunctions.setEditorState(RichUtils.toggleBlockType(editorState, 'paragraph'));
        return 'handled';
      }
      return 'not-handled';
    }
  };
  return plugin;
};

const createBreakPlugin = () => {
  let plugin: EditorPlugin  = {
    handleKeyCommand: (command: EditorCommand, editorState: EditorState, _eventTimeStamp: number, pluginFunctions: PluginFunctions): DraftHandleValue => {
      if (command === 'break') {
        pluginFunctions.setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }
      return 'not-handled';
    }
  };
  return plugin;
};

const createKeyBindingPlugin = () => {
  let plugin: EditorPlugin  = {
    keyBindingFn: (evt: KeyboardEvent, _pluginFunctions: PluginFunctions): EditorCommand | null | undefined => {
      if (evt.shiftKey && evt.key === 'Enter') {
        return 'break';
      } else if (evt.ctrlKey && evt.key === 'h') {
        return 'hightlight';
      }
      return getDefaultKeyBinding(evt);
    }
  };
  return plugin;
};

export { createKeyBindingPlugin, createParagraphPlugin, createHighlightPlugin, createBreakPlugin }