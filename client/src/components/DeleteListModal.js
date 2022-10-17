import React, { Component, useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'

function DeleteListModal() {
    //const [idNamePair, currentLists, newListCounters, listNameActives] = useState('');
    const {store} = useContext(GlobalStoreContext)

        return (
            <div 
                className="modal" 
                id="delete-list-modal" 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-delete-list-root'>
                        <div className="modal-north">
                            Delete playlist?
                        </div>
                        <div className="modal-center">
                            <div className="modal-center-content">
                                Are you sure you wish to permanently delete the replace playlist?
                            </div>
                        </div>
                        <div className="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                className="modal-button" 
                                onClick={store.deleteCurrentList2}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                className="modal-button" 
                                onClick={store.hideDeleteListModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
}

export default DeleteListModal