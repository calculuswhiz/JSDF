let DoublyLinkedList = (function(val){
    let map = new WeakMap();

    let internal = function(object){
        if(!map.has(object))
            map.set(object, {});
        return map.get(object);
    }

    let Node = function(data){
        this.data = data;
        this.prev = null;
        this.next = null;
    };
        
    function DoublyLinkedList(val){
        let ns = internal(this);
        if(val == null){
            ns.head = null;
            ns.tail = null;
            ns.length = 0;
        }
        else{
            ns.head = new Node(val);
            ns.tail = ns.head;
            ns.length = 1;
        }
        
        Object.defineProperty(this,"length", {get: function(){return ns.length}});
        
        // Internal use only.
        ns.getNode = function(index){
            if(index < 0 || index > ns.length)
                throw "Index out of bounds";
            let curPtr = ns.head;
            for(let i=0; i<index; i++){
                curPtr = curPtr.next;
            }
            
            return curPtr;
        }.bind(this);
    }
        
    
    DoublyLinkedList.prototype.indexOf = function(value) {
        let ns = internal(this);
        let curNode = ns.head;
        let i=0;
        while(i++<ns.length && curNode.data!=value){
            curNode = curNode.next;
        }
        return i;
    };
    
    DoublyLinkedList.prototype.lastIndexOf = function(value) {
        let curNode = ns.tail;
        let i=ns.length-1;
        while(i--<ns.length && curNode.data!=value){
            curNode = curNode.prev;
        }
        return i;
    };
    
    DoublyLinkedList.prototype.getLength = function(){
        let ns = internal(this);
        return ns.length;
    };
    
    DoublyLinkedList.prototype.swap = function(a,b) {
        let ns = internal(this);
        if(a<0 || a>ns.length || b<0 || b>ns.length)
            throw "Index out of bounds";
        
        if(a==b)
            return;
        
        if(b<a){
            let tmp = b;
            b = a;
            a = tmp;
        }
        
        let front = {el: ns.head, i:0};
        let back = {el: ns.tail, i:ns.length-1};
        
        while(front.i < a){
            front.i++;
            front.el = front.el.next;
        }
        while(back.i > b){
            back.i--;
            back.el = back.el.prev;
        }
        
        // Swap data pair.
        let temp = front.el.data;
        front.el.data = back.el.data;
        back.el.data = temp;
    };
    
    DoublyLinkedList.prototype.appendList = function(endList) {
        let tmpArr = endList.toArray();
        for(let i=0, len=tmpArr.length; i<len; i++){
            this.push_back(tmpArr[i]);
        }
    };
    
    // Ok, this time, we're just going to swap contents.
    // The reason we can do this is because all Objects, arrays, etc. are actually just references.
    // Therefore it's actually more costly to change the next-prev pointers (2n plus edge checks vs 3n/2).
    DoublyLinkedList.prototype.reverse = function(a,b) {
        let ns = internal(this);
        a|=0; // if null, set 0;
        
        if(b==null)
            b=ns.length-1;
        if(a>b || a<0 || b<=0 || a>=ns.length || b>=ns.length)
            throw "Index out of bounds";
        if(a==b)
            return;
        
        let front = {el: ns.head, i:0};
        let back = {el: ns.tail, i:ns.length-1};
        
        while(front.i < a){
            front.i++;
            front.el = front.el.next;
        }
        while(back.i > b){
            back.i--;
            back.el = back.el.prev;
        }
        
        // Swap each data pair.
        while(front.i < back.i){
            front.i++;
            back.i--;
            let temp = front.el.data;
            front.el.data = back.el.data;
            back.el.data = temp;
        }
    };

    DoublyLinkedList.prototype.insertAt = function(index, value) {
        let ns = internal(this);
        if(index > ns.length || index < 0)
            throw "Index out of bounds";
        
        ns.length += 1;
        // Make new
        if(ns.head == null){
            ns.head = new Node(value);
            ns.tail = ns.head;
            return;
        }
        
        let curNode = ns.head;
        let tempNode = new Node(value);
        
        // Insert beginning.
        if(index == 0){
            tempNode.next = ns.head;
            ns.head = tempNode;
            return;
        }
        
        for(let i=0; i<index-1; i++){
            curNode = curNode.next;
        }
        
        // Curnode points to previous.
        tempNode.next = curNode.next;
        curNode.next = tempNode;
        tempNode.prev = curNode;
        
        if(tempNode.next == null)
            ns.tail = tempNode;
        else
            tempNode.next.prev = tempNode;
    };
    
    DoublyLinkedList.prototype.push_back = function(value){
        this.insertAt(internal(this).length, value);
    };
    
    DoublyLinkedList.prototype.push_front = function(value){
        this.insertAt(0, value);
    };
    
    DoublyLinkedList.prototype.removeAt = function(index) {
        let ns = internal(this);
        if(index >= ns.length || index < 0 || ns.length == 0)
            throw "Index out of bounds";
        
        ns.length -= 1;
        
        if(ns.length == 0){
            ns.head = null;
            ns.tail = null;
            return; // No references left.
        }
        
        let curNode = ns.head;
        if(index == 0){
            ns.head = curNode.next; // Garbage collector should get it.
            ns.head.prev = null;
            return;
        }
        
        for(let i=0; i<index-1; i++){
            curNode = curNode.next;
        }
        
        // curNode points to previous.
        curNode.next = curNode.next.next;
        
        if(curNode.next == null)
            ns.tail = curNode;
        else
            curNode.next.prev = curNode;
    };
    
    DoublyLinkedList.prototype.pop_back = function() {
        return this.removeAt(internal(this).length-1);
    };
    
    DoublyLinkedList.prototype.pop_front = function() {
        return this.removeAt(0);
    };
    
    DoublyLinkedList.prototype.assign = function(index, value) {
        let ns = internal(this);
        if(index >= ns.length || index < 0 || ns.length == 0)
            throw "Index out of bounds";
        
        let curNode = ns.head;
        
        for(let i=0; i<index; i++){
            curNode = curNode.next;
        }
        
        curNode.data = value;
    };
    
    DoublyLinkedList.prototype.sort = function(compareFunction) {
        let ns = internal(this);
        if(compareFunction == null){
            compareFunction = function(a,b){
                if(a<b) return -1;
                if(a>b) return 1;
                return 0;
            };
        }
        
        function mergeSortArray(sortMe){
            if(sortMe.length == 1){
                return sortMe;
            }
            
            let sortedArray = [];
            for(let pairIndex=0, len=sortMe.length; pairIndex<len; pairIndex+=2){
                let a_i = 0, b_i = 0;
                let asrc = sortMe[pairIndex], bsrc = sortMe[pairIndex+1];
                let alim = asrc.length, blim = bsrc.length;
                sortedArray[pairIndex/2] = [];
                let putbox = sortedArray[pairIndex/2];
                
                while(a_i<alim && b_i<blim){
                    let result = compareFunction(asrc[a_i], bsrc[b_i]);
                    if(result>0){
                        putbox.push(bsrc[b_i++]);
                    } else {
                        putbox.push(asrc[a_i++]);
                    }
                }
                // push remainder:
                while(a_i < alim) {
                    putbox.push(asrc[a_i++]);
                }
                while(b_i < blim) {
                    putbox.push(bsrc[b_i++]);
                }
            }
            
            return mergeSortArray(sortedArray);
        }
        
        let initList = [];
        let curNode = ns.head;
        for(let i=0, len=ns.length; i<len; i++){
            initList.push([curNode.data]);
            curNode = curNode.next;
        }
        let sorted = mergeSortArray(initList)[0];
        let result = new DoublyLinkedList();
        for(let i=0, len=sorted.length; i<len; i++){
            result.push_back(sorted[i]);
        }
        ns.head = internal(result).head;
        ns.tail = internal(result).tail;
    };
    
    DoublyLinkedList.prototype.sublist = function(index,len) {
        let ns = internal(this);
        index |= 0;
        if(len == null)
            len = ns.length - index;
        if(index < 0 || index > ns.length)
            throw "Index out of bounds";
        var retList = new DoublyLinkedList();
        
        let curNode = ns.head;
        for(let i=0; i<index; i++){
            curNode = curNode.next;
        }
        
        for(let i=0; i<len; i++){
            retList.push_back(curNode.data);
            curNode = curNode.next;
        }
        
        return retList;
    };
    
    DoublyLinkedList.prototype.getValueAt = function(index){
        let ns = internal(this);
        if(index >= ns.length || index < 0)
            return null;
        
        let curNode = ns.head;
        for(let i=0; i<index; i++){
            curNode = curNode.next;
        }
        return curNode.data;
    };
    
    DoublyLinkedList.prototype.toArray = function(){
        let ns = internal(this);
        let curNode = ns.head;
        let temp = [];
        for(let i=0, len=ns.length; i<len; i++){
            temp.push(curNode.data);
            curNode = curNode.next;
        }
        return temp;
    };
    
    return DoublyLinkedList;
})();
