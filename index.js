const undoRedo = (state) => {
  const actions = [];
  const undoStack = [];

  const EDIT_VALUE = "edit";
  const ADD_VALUE = "add";
  const DELETE_VALUE = "delete";

  const ERROR_MESSAGE = "There is no operation to";
  const UNDO_MESSAGE = `${ERROR_MESSAGE} undo`;
  const REDO_MESSAGE = `${ERROR_MESSAGE} redo`;

  const clearUndo = () => {
    while (undoStack.length) {
      undoStack.pop();
    }
  };

  const setUndoState = (action) => {
    const { actionType, key } = action;
    switch (actionType) {
      case ADD_VALUE: {
        delete state[key];
        break;
      }
      case EDIT_VALUE: {
        state[key] = action.prevValue;
        break;
      }

      case DELETE_VALUE: {
        state[key] = action.prevValue;
        break;
      }
    }
    undoStack.push(action);
    return state;
  };

  const setRedoState = (action) => {
    const { actionType, key } = action;
    switch (actionType) {
      case ADD_VALUE: {
        state[key] = action.currentValue;
        break;
      }

      case EDIT_VALUE: {
        state[key] = action.currentValue;
        break;
      }

      case DELETE_VALUE: {
        delete state[key];
        break;
      }
    }
    actions.push(action);
    return state;
  };

  return {
    set(key, value) {
      if (state.hasOwnProperty(key)) {
        actions.push({
          actionType: EDIT_VALUE,
          prevValue: state[key],
          currentValue: value,
          key,
        });
      } else {
        actions.push({
          actionType: ADD_VALUE,
          currentValue: value,
          key,
        });
      }
      state[key] = value;
      clearUndo();
    },
    get(key) {
      return state[key];
    },
    del(key) {
      actions.push({
        actionType: DELETE_VALUE,
        prevValue: state[key],
        key,
      });
      delete state[key];
      clearUndo();
    },

    undo() {
      if (!actions.length) {
        throw new Error(UNDO_MESSAGE);
      }
      return setUndoState(actions.pop());
    },

    redo() {
      if (!undoStack.length) {
        throw new Error(REDO_MESSAGE);
      }
      return setRedoState(undoStack.pop());
    },
  };
};
