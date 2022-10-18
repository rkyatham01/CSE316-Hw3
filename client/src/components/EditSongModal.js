import React, { Component, useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'

function EditSongModal() {
     const {store} = useContext(GlobalStoreContext)

        return (
            <div 
            className="modal" 
                id="edit-song-modal" 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-edit-song-root'>
                        <div className="modal-north">
                            Edit Song
                        </div>

                        <div className="modal-center">
                                Title: <input id="titleText" placeholder="Enter Title"/>
                                Artist: <input id="artistText" placeholder="Enter Artist"/>
                                YouTube Id: <input id="youtubeId" placeholder="Enter Youtube Id"/>
                        </div>

                        <div className="modal-south">
                            <input type="button" 
                                id="edit-song-confirm-button" 
                                className="modal-button" 
                                onClick={ store.editSongTransaction}
                                value='Confirm' />
                            <input type="button" 
                                id="edit-song-cancel-button" 
                                className="modal-button" 
                                onClick={store.editSongCancel}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }

export default EditSongModal