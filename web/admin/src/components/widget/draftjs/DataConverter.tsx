import React from 'react';
import { EditorState } from "draft-js";

import * as DraftConvert from 'draft-convert';
export interface IDataConverter {
  toPlainText: (editorState: EditorState) => string;
  toHtml: (editorState: EditorState) => string;
  fromHtml: (html: string) => EditorState;
}
export class NewDataConverter implements IDataConverter {
  toPlainText(editorState: EditorState) {
    let text = editorState.getCurrentContent().getPlainText('\u0001');
    return text;
  }

  toHtml(editorState: EditorState) {
    const html = DraftConvert.convertToHTML({
      styleToHTML: (style) => {
        if (style === 'BOLD') {
          return <span style={{ color: 'blue' }} />;
        }
        return undefined;
      },
      blockToHTML: (block) => {
        if (block.type === 'unstyled') {
          return <div/>;
        } else if (block.type === 'paragraph') {
          return <p/>;
        }
        return undefined;
      },
      entityToHTML: (entity, originalText) => {
        if (entity.type === 'LINK') {
          return <a href={entity.data.url}>{originalText}</a>;
        }
        return originalText;
      }
    })(editorState.getCurrentContent());
    return html;
  }

  fromHtml(html: string) {
    const contentState = DraftConvert.convertFromHTML({
      htmlToStyle: (nodeName, node, currentStyle) => {
        if (nodeName === 'span' && node.style.color === 'blue') {
          return currentStyle.add('BLUE');
        } else {
          return currentStyle;
        }
      },
      htmlToEntity: (nodeName, node, createEntity) => {
        if (nodeName === 'a') {
          return createEntity('LINK', 'MUTABLE', { url: node.href })
        }
        return undefined;
      },
      /*
      textToEntity: (text, createEntity) => {
        const result: Array<any> = [];
        text.replace(/\@(\w+)/g, (match, name, offset) => {
          const entityKey = createEntity( 'AT-MENTION', 'IMMUTABLE', { name });
          result.push({ entity: entityKey, offset, length: match.length, result: match });
        });
        return result;
      },
      */
      htmlToBlock: (nodeName, _node) => {
        if (nodeName === 'blockquote') {
          return { type: 'blockquote', data: {} };
        } else if (nodeName === 'paragraph') {
          return { type: 'paragraph', data: {} };
        }
        return undefined;
      }
    })(html);
    const editorState = EditorState.createWithContent(contentState);

    return editorState;
  }
}