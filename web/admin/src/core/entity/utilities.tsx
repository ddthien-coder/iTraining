import { server, widget } from 'components';

type RecordConfig = widget.grid.RecordConfig;
const getRecordState = widget.grid.model.getRecordState
export class EntityUtil {
  static fromServer(response: server.rest.RestResponse) {
    let entity = response.data;
    if (!entity.id) {
      throw new Error('Not a valid entity from server');
    }
    return entity;
  }

  static clone(entity: any, clearId: boolean) {
    let clone = JSON.parse(JSON.stringify(entity));
    if (clearId) {
      delete clone.id;
    }
    return clone;
  }

  static clearId(entity: any) {
    if (!entity) return;
    delete entity.id;
  }

  static clearIds(entities: Array<any>) {
    if (!entities) return;
    for (let entity of entities) {
      delete entity.id;
    }
  }

  static toDynamicEntity(config: RecordConfig, entity: any) {
    let modEntity: any = {};
    let recState = getRecordState(entity);
    if (recState.isMarkDeleted()) {
      modEntity.editState = 'DELETED';
    } else if (recState.isMarkNew()) {
      modEntity.editState = 'NEW';
    } else if (recState.isMarkModified()) {
      modEntity.editState = 'MODIFIED';
    } else {
      throw new Error('Invalid entity or state');
    }

    modEntity.id = entity.id;
    for (let field of config.fields) {
      if (!field.editor) continue;
      modEntity[field.name] = entity[field.name];
    }
    return modEntity;
  }
}

export class EntityListUtil {
  static cloneArray(srcArray: Array<any>, destArray: Array<any>) {
    if (!srcArray) return '';
    for (let entity of srcArray) {
      let cloneEntity = JSON.parse(JSON.stringify(entity));
      delete entity.id;
      destArray.push(cloneEntity);
    }
    return destArray;
  }

  static toDynamicEntities(
    config: RecordConfig, entities: Array<any>, transform?: (entity: any, newEntity: any) => void) {
    let holder: Array<any> = [];
    for (let entity of entities) {
      let dynamicEntity = EntityUtil.toDynamicEntity(config, entity);
      if (transform) transform(entity, dynamicEntity);
      holder.push(dynamicEntity);
    }
    return holder;
  }
}