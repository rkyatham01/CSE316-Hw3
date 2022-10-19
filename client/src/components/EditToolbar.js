import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    
     function addButtonHandler() {
        store.addSongTransaction();
     }

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    let editStatus = false;
    if (store.songEditActive) {
        editStatus = true;
    }
     let enabledButtonClass = "playlister-button";
     let disabledButtonClass = "playlister-button-disabled";

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
              //  disabled={false}
                value="+"
                className={store.isOpen ? enabledButtonClass : disabledButtonClass}
                onClick={addButtonHandler}

            />
            <input
                type="button"
                id='undo-button'
                //disabled={!store.isUndo}
                value="⟲"
                className={store.isUndo ? enabledButtonClass : disabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                //disabled={!canRedo}
                value="⟳"
                className={store.isRedo ? enabledButtonClass : disabledButtonClass }
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                //disabled={!canClose}
                value="&#x2715;"
                className={store.isClose ? enabledButtonClass : disabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;