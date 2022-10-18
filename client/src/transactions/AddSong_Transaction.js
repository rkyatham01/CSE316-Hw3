import jsTPS_Transaction from "../common/jsTPS"
/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works.
 *  It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initApp) {
        super();
        this.store = initApp;
    }
    

    doTransaction = () => {
        this.store.addSongButton()
    }

    
    undoTransaction = () => {
        this.store.deleteLastElement(-1);        
    }

}