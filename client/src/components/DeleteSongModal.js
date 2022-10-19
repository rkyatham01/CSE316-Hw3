import React, { Component, useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'

function DeleteSongModal() {
    const {store} = useContext(GlobalStoreContext)
    //store.currentList.songs[store.IndxSongToDel]
    let songName = '';
    if(store.currentList != null && store.currentList.songs != null && store.IndxToDel != null){
        songName = (store.currentList.songs[store.IndxToDel].title);
    }

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
                                Are you sure you wish to permanently delete {songName} from the playlist?
                            </div>
                        </div>
                        <div className="modal-south">
                            <input type="button" 
                                id="delete-song-confirm-button" 
                                className="modal-button" 
                                onClick={store.deleteSongTransaction}
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