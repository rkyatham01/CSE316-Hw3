import jsTPS_Transaction from "../common/jsTPS"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, index, newElement, oldElement) {
        super();
        this.store = initApp;
        this.Index = index;
        this.newElement = newElement;
        this.oldElement = oldElement;
    }
    
    doTransaction() {
        this.store.editSong2(this.Index, this.newElement); //replacing with new element
    }
        
    undoTransaction() {
        this.store.editSong2(this.Index, this.oldElement);  //replacing with old element back
    }
    
}