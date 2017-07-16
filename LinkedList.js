let LinkedList = (function(val){
    let map = new WeakMap();

    let internal = function(object){
        if(!map.has(object))
            map.set(object, {});
        return map.get(object);
    }

    let Node = function(data){
        this.data = data;
        this.next = null;
    };
    
    
    function LinkedList(val){
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
        
        Object.defineProperty(this,"length", {get: function(){return ns.length}.bind(this)});
        
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
    
    LinkedList.prototype.indexOf = function(value) {
        let ns = internal(this);
        let curNode = ns.head;
        let i=0;
        while(i++<ns.length && curNode.data!=value){
            curNode = curNode.next;
        }
        return i;
    };
    
    LinkedList.prototype.getLength = function(){
        let ns = internal(this);
        return ns.length;
    };
    
    LinkedList.prototype.swap = function(a,b) {
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
        
        if(a == b-1){
            this.reverse(a,b);  // What? Me? Lazy?
            return;
        }
        
        if(a == 0){
            let nodeBpre = ns.getNode(b-1);
            var nodeA = ns.head;
            ns.head = nodeBpre.next;
            nodeBpre.next = nodeA;
            ns.head.next = nodeA.next;
            nodeA.next = ns.head.next;
            if(b == ns.length-1)
                ns.tail = nodeBpre.next;
        }
        else{
            let nodeApre = ns.getNode(a-1);
            let nodeBpre = ns.getNode(b-1);
            let tmp = nodeApre.next;
            nodeApre.next = nodeBpre.next;
            nodeBpre.next = tmp;
            
            let nodeB = nodeApre.next;
            let nodeA = nodeBpre.next;
            
            tmp = nodeA.next;
            nodeA.next = nodeB.next;
            nodeB.next = nodeA.next;
            
            if(b == ns.length-1)
                ns.tail = nodeA;
        }
    };
    
    LinkedList.prototype.appendList = function(endList) {
        let tmpArr = endList.toArray();
        for(let i=0, len=tmpArr.length; i<len; i++){
            this.push_back(tmpArr[i]);
        }
    };
    
    LinkedList.prototype.reverse = function(a,b) {
        let ns = internal(this);
        a|=0; // if null, set 0;
        
        if(b==null)
            b=ns.length-1;
        if(a>b || a<0 || b<=0 || a>=ns.length || b>=ns.length)
            throw "Index out of bounds";
        if(a==b)
            return;
        
        let curNode = ns.head;
        let nodeList = [];
        
        // curNode = one before
        for(let i=0; i<a-1; i++){
            curNode = curNode.next;
        }
        
        if(a==0){
            nodeList.push(null);
            b-=1;
        }
        
        nodeList.push(curNode);
        
        for(let i=0; i<b-a+2; i++){
            curNode = curNode.next;
            nodeList.push(curNode);
        }
        
        // Reverse within area first:
        for(let i=1, len=nodeList.length; i<len-2; i++){
            nodeList[i+1].next = nodeList[i];
        }
        
        // Handle potential edge cases:
        // Head is null:
        if(nodeList[0] == null){
            ns.head = nodeList[nodeList.length-2];
        }
        else{
            nodeList[0].next = nodeList[nodeList.length-2];
        }
        
        // Tail is null:
        if(nodeList[nodeList.length-1] == null){
            ns.tail = nodeList[1];
        }
    
        nodeList[1].next = nodeList[nodeList.length-1];
    };

    LinkedList.prototype.insertAt = function(index, value) {
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
        
        if(tempNode.next == null)
            ns.tail = tempNode;
    };
    
    LinkedList.prototype.push_back = function(value){
        this.insertAt(internal(this).length, value);
    };
    
    LinkedList.prototype.push_front = function(value){
        this.insertAt(0, value);
    };
    
    LinkedList.prototype.removeAt = function(index) {
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
            return;
        }
        
        for(let i=0; i<index-1; i++){
            curNode = curNode.next;
        }
        
        // curNode points to previous.
        curNode.next = curNode.next.next;
        
        if(curNode.next == null)
            ns.tail = curNode;
    };
    
    LinkedList.prototype.pop_back = function() {
        return this.removeAt(internal(this).length-1);
    };
    
    LinkedList.prototype.pop_front = function() {
        return this.removeAt(0);
    };
    
    LinkedList.prototype.assign = function(index, value) {
        let ns = internal(this);
        if(index >= ns.length || index < 0 || ns.length == 0)
            throw "Index out of bounds";
        
        let curNode = ns.head;
        
        for(let i=0; i<index; i++){
            curNode = curNode.next;
        }
        
        curNode.data = value;
    };
    
    LinkedList.prototype.sublist = function(index,len) {
        let ns = internal(this);
        index |= 0;
        if(len == null)
            len = ns.length - index;
        if(index < 0 || index > ns.length)
            throw "Index out of bounds";
        var retList = new LinkedList();
        
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
    
    LinkedList.prototype.getValueAt = function(index){
        let ns = internal(this);
        if(index >= ns.length || index < 0)
            return null;
        
        let curNode = ns.head;
        for(let i=0; i<index; i++){
            curNode = curNode.next;
        }
        return curNode.data;
    };
    
    LinkedList.prototype.toArray = function(){
        let ns = internal(this);
        let curNode = ns.head;
        let temp = [];
        for(let i=0, len=ns.length; i<len; i++){
            temp.push(curNode.data);
            curNode = curNode.next;
        }
        return temp;
    };
    
    return LinkedList;
})();
