import {
  NODE_EDIT,
  NODE_SAVE,
  NODE_ADD,
  NODE_DELETE,
  NODE_CHANGE,

  BLOCK_ADD,
  BLOCK_SET_DATETIME,

  CAMPAIGN_SAVE
} from '../constants/actions.jsx';


export function handleEditNode(dispatch) {
  return (node) => {
    dispatch({type: NODE_EDIT, node});
  };
}

export function handleSaveNode(dispatch) {
  return (node) => {
    dispatch({type: NODE_SAVE, node: node});
  };
}

export function handleAddNode(dispatch) {
  return (id) => {
    dispatch({type: NODE_ADD, block: {id: id}});
  };
}

export function handleDeleteNode(dispatch) {
  return (id) => {
    dispatch({type: NODE_DELETE, node: {id: id}});
  };
}

export function handleAddBlock(dispatch) {
  return () => {
    dispatch({type: BLOCK_ADD});
  };
}

export function handleSetDatetime(dispatch) {
  return (block) => {
    dispatch({type: BLOCK_SET_DATETIME, block});
  };
}
