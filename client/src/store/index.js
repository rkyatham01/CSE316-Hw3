import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';

export const GlobalStoreContext = createContext({});
//import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
//import EditSong_Transaction from '../transactions/EditSong_Transaction';

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/


// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION

export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        IndxToDel: 0,
        IndxSongToDel: 0
    });
    

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }

            //KEEP SAME SONG 
            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    IndxToDel: payload,
                })
            }
            
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    IndxToDel: payload,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    store.deleteCurrentList = function (id){

        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: id
        });

        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    
    store.hideDeleteListModalCallback = function (){
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
        return;
    }

    store.addSongButton = function (){
        let newElement = {
            artist: "Unknown",
            title: "Untitled",
            youTubeId: "dQw4w9WgXcQ",
        }
        let newList = store.currentList
        newList.songs.push(newElement)    

        async function asyncaddSong() {
            const response = await api.updatePlaylistAddSong(store.currentList._id, newList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: newList
                });
            //    store.loadIdNamePairs() // update playlist in
            }
            else {
                console.log("API FAILED TO ADD SONG");
            }
        }
        asyncaddSong();
    
    }

    store.deleteLastElement = (songToDelete) => {
        let newListRemove = store.currentList;
        
        (newListRemove.songs).splice(songToDelete, 1)
        async function asyncaddSong() {
            const response = await api.updatePlaylistAddSong(store.currentList._id, newListRemove);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: newListRemove
                });
            }
            else {
                console.log("API FAILED TO ADD SONG");
            }
        }
        asyncaddSong();
    }

    store.removeSong1 = function (index){
         storeReducer({
             type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
             payload: index
         });

        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }

    store.cancelRemoveSong = function (){
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible"); 
    }

    store.removeSong2 = function (indexTodelete){
        let newListRemove = store.currentList;
        
        (newListRemove.songs).splice(indexTodelete, 1)
        async function asyncaddSong() {
            const response = await api.updatePlaylistAddSong(store.currentList._id, newListRemove);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: newListRemove
                });
            //    store.loadIdNamePairs() // update playlist in
            let modal = document.getElementById("delete-song-modal");
            modal.classList.remove("is-visible"); 
            }
            else {
                console.log("API FAILED TO ADD SONG");
            }
        }
        asyncaddSong();
    }

    store.addSongBack = function (indexWhere, elementBack){
        let newListAddedback = store.currentList
        newListAddedback.songs.splice(indexWhere,0,elementBack);
        async function asyncaddSong() {
            const response = await api.updatePlaylistAddSong(store.currentList._id, newListAddedback);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: newListAddedback
                });
            //    store.loadIdNamePairs() // update playlist in
            let modal = document.getElementById("delete-song-modal");
            modal.classList.remove("is-visible"); 
            }
            else {
                console.log("API FAILED TO ADD SONG");
            }
        }
        asyncaddSong();

    }

    store.deleteCurrentList2 = function(){
        async function asyncRemovePlaylist() {
            const response = await api.removePlaylist(store.IndxToDel);
            if (response.data.success){
                //have to update state here to represent in UI
                store.loadIdNamePairs()
                store.hideDeleteListModalCallback()
            }
            else{
                console.log("API FAILED TO REMOVE PLAYLIST")
            }

        }
        asyncRemovePlaylist()
    }

    store.editSong1 = function(index) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: index
        });

        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
        return
    }

    store.editSongCancel = function(){
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    store.editSong2 = function(index, anyElement) {
        let newListEdit = store.currentList;

        newListEdit.songs[index] = anyElement;

        async function asyncEditSong() {
            const response = await api.updatePlaylistAddSong(store.currentList._id, newListEdit);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: newListEdit
                });
                let modal = document.getElementById("edit-song-modal");
                modal.classList.remove("is-visible"); 
            }
            
            else{
                console.log("API FAILED TO EDIT SONG")
            }
        }
        asyncEditSong()

    }

    //createNewList
    store.createNewList = function () {
        async function asyncaddPlayList() {
            const response = await api.addPlaylist();
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                });
                store.loadIdNamePairs()
            }
            else {
                console.log("API FAILED TO ADD PLAYLIST");
            }
        }
        asyncaddPlayList();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.addSongTransaction = () => {
        let newaddtransaction = new AddSong_Transaction(store);
        tps.addTransaction(newaddtransaction);
    }

    store.deleteSongTransaction = () => {
        let index = store.IndxToDel;
        let newElement = store.currentList.songs[index]; //replaces the element there
        let newDeltransaction = new DeleteSong_Transaction(store, index, newElement);
        tps.addTransaction(newDeltransaction);
    }

    store.editSongTransaction = () => {
        var theTitle = document.getElementById("titleText").value;
        var theArtist = document.getElementById("artistText").value;
        var theYoutubeID = document.getElementById("youtubeId").value;

        let newElement = {
            artist: theArtist,
            title: theTitle,
            youTubeId: theYoutubeID,
        }
         let index = store.IndxToDel;
         let oldElement = store.currentList.songs[index]
         let newEdittransaction = new EditSong_Transaction(store, index, newElement, oldElement)
         tps.addTransaction(newEdittransaction);
    }

    store.moveSong = function(start, end) {
        
        let list = store.currentList

        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        
        async function updateListForMoveSong() {
            const response = await api.updatePlaylistAddSong(store.currentList._id, list);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list
                });
            }
            else {
                console.log("API FAILED TO MOVE SONG");
            }
        }
        updateListForMoveSong();

    }

    store.MoveSongTransaction = function (starts, ends) {
        let transaction = new MoveSong_Transaction(store, starts, ends);
        tps.addTransaction(transaction);
    }


    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}
