const videoItemSchema = {
  type: 'object',
  properties: {
    content: {
      file: 'string'

    },
    isDone: {
      type: 'boolean',
      default: false
    }
  },
};

module.exports = todoItemSchema;
