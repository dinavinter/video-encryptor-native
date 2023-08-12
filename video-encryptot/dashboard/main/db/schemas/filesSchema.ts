import {
  RxCollection, RxDatabase, RxDocument, RxJsonSchema
} from 'rxdb';
import {BlobBuffer} from "rxdb/dist/types/types";
import {RxAttachment} from "rxdb/dist/types/types/rx-attachment";
 

export const fileSchema: RxJsonSchema<any> = {
  title: 'file schema',
  description: 'describes a protected file',
  version: 0,
  keyCompression: true,
  type: 'object',
  primaryKey: "name",

  properties: {
    name: {
      "type": "string",
      "maxLength": 100 // <- the primary key must have set maxLength
    },
    size: {
      type: 'number'
    },
    created: {
      type: 'string'
    },
    url: {
      type: 'string'
    },
    status: {
      type: 'string'
    },
    error: {
      type: 'object'
    }
  },
  attachments: {},
  required: ['name']
};




