export * from './type'
export * from './UISearchParams'

/**
 * @deprecated The method should not be used
 */
export const SEARCH_FILTER = [
  { "name": "search", "type": "STRING_LIKE", "required": true, "filterValue": "*" }
];

export function createSearchFilter(pattern: string = "") {
  return [{ "name": "search", "type": "STRING_LIKE", "required": true, "filterValue": pattern }];
}

/**
 * @deprecated The method should not be used
 */
export const ENTITY_STATE_FILTER = [
  {
    "name": "entityState", "label": "State", "type": "STRING", "required": true,
    "options": ["", "ACTIVE", "INACTIVE", "ARCHIVED", "JUNK", "DEPRECATED"],
    "optionLabels": ["All", "Active", "Inactive", "Archived", "Junk", "Deprecated"],
    "selectOption": "ACTIVE"
  }
];

export function createEntityStateFilter() {
  return [
    {
      "name": "entityState", "label": "State", "type": "STRING", "required": true,
      "options": ["", "ACTIVE", "INACTIVE", "ARCHIVED", "JUNK", "DEPRECATED"],
      "optionLabels": ["All", "Active", "Inactive", "Archived", "Junk", "Deprecated"],
      "selectOption": "ACTIVE"
    }
  ];
}

/**
 * @deprecated The method should not be used
 */
export const MODIFIED_TIME_FILTER = [
  {
    "name": "modifiedTime", "label": "Modified Time", "type": "DATE", "required": true,
    "fromValue": null, "toValue": null
    //"fromValue": "1/1/2010@10:00:00 +0000", "toValue": "1/1/2030@10:00:00 +0000"
  }
];

export function createModifiedTimeFilter() {
  return [
    {
      "name": "modifiedTime", "label": "Modified Time", "type": "DATE", "required": true,
      "fromValue": null, "toValue": null
      //"fromValue": "1/1/2010@10:00:00 +0000", "toValue": "1/1/2030@10:00:00 +0000"
    }
  ];
}

export function createCreatedTimeFilter() {
  return [
    {
      "name": "createdTime", "label": "Created Time", "type": "DATE", "required": true,
      "fromValue": null, "toValue": null
      //"fromValue": "1/1/2010@10:00:00 +0000", "toValue": "1/1/2030@10:00:00 +0000"
    }
  ];
}

/**
 * @deprecated The method should not be used
 */
export const CREATED_TIME_FILTER = [
  {
    "name": "createdTime", "label": "Created Time", "type": "DATE", "required": true,
    "fromValue": null, "toValue": null
    //"fromValue": "1/1/2010@10:00:00 +0000", "toValue": "1/1/2030@10:00:00 +0000"
  }
];

/**
 * @deprecated The method should not be used
 */
export const ORDER_BY = {
  fields: ["modifiedTime"],
  fieldLabels: ["Modified Time"],
  selectFields: null,
  sort: "DESC"
};

export function createDefaultOrderBy() {
  return {
    fields: ["modifiedTime"],
    fieldLabels: ["Modified Time"],
    selectFields: null,
    sort: "DESC"
  };
}

export function createOrderBy(fields: Array<string>, labels?: Array<string>) {
  return { fields: fields, fieldLabels: labels, selectFields: null, sort: "DESC" };
}

/**@deprecated */
export function createStateFilter(states: Array<"ACTIVE" | "INACTIVE" | "ARCHIVED" | "JUNK" | "DEPRECATED">) {
  let options = [""];
  let labels = ["All"];
  for (let i = 0; i < states.length; i++) {
    options.push(states[i]);
    let label = states[i].toLowerCase();
    label = label.charAt(0).toUpperCase() + label.slice(1);
    labels.push(label);
  }

  let filter = {
    name: 'entityState', label: 'State', type: 'STRING', required: true,
    options: options,
    optionLabels: labels,
    selectOption: states[0]
  };
  return filter;
}
export function createStorageStateFilter(states: Array<"ACTIVE" | "INACTIVE" | "ARCHIVED" | "JUNK" | "DEPRECATED">) {
  let options = [""];
  let labels = ["All"];
  for (let i = 0; i < states.length; i++) {
    options.push(states[i]);
    let label = states[i].toLowerCase();
    label = label.charAt(0).toUpperCase() + label.slice(1);
    labels.push(label);
  }

  let filter = {
    name: 'storageState', label: 'State', type: 'STRING', required: true,
    options: options,
    optionLabels: labels,
    selectOption: states[0]
  };
  return filter;
}

export function createEditModeFilter(modes: Array<"DRAFT" | "VALIDATED" | "LOCKED">) {
  let options = [""];
  let labels = ["All"];
  for (let i = 0; i < modes.length; i++) {
    options.push(modes[i]);
    let label = modes[i].toLowerCase();
    label = label.charAt(0).toUpperCase() + label.slice(1);
    labels.push(label);
  }

  let filter = {
    name: 'editMode', label: 'Mode', type: 'STRING', required: true,
    options: options,
    optionLabels: labels,
    selectOption: ''
  };
  return filter;
}