import React, { Component, useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'

function DeleteSongModal() {
    //const [idNamePair, currentLists, newListCounters, listNameActives] = useState('');
    const {store} = useContext(GlobalStoreContext)

        return (
            <div 
                className="modal" 
                id="delete-song-modal" 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-delete-song-root'>
                        <div className="modal-north">
                            Delete song?
                        </div>
                        <div className="modal-center">
                            <div className="modal-center-content">
                                Are you sure you wish to permanently delete the replace playlist?
                            </div>
                        </div>
                        <div className="modal-south">
                            <input type="button" 
                                id="delete-song-confirm-button" 
                                className="modal-button" 
                                onClick={store.removeSong2}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-song-cancel-button" 
                                className="modal-button" 
                                onClick={store.cancelRemoveSong}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
}

export default DeleteSongModal