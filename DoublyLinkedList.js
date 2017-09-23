let DoublyLinkedList = (function(val){
    // Private member access
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
        let my = internal(this);
        if(val == null){
            my.head = null;
            my.tail = null;
            my.length = 0;
        }
        else{
            my.head = new Node(val);
            my.tail = my.head;
            my.length = 1;
        }
        
        Object.defineProperty(this,"length", {get: function(){return my.length}});
        
        // Internal use only.
        my.getNode = function(index){
            if(index < 0 || index > my.length)
                throw "Index out of bounds";
            let curPtr = my.head;
            for(let i=0; i<index; i++){
                curPtr = curPtr.next;
            }
            
            return curPtr;
        }.bind(this);
    }
        
    
    DoublyLinkedList.prototype.indexOf = function(value) {
        let my = internal(this);
        let curNode = my.head;
        let i=-1;
        while(i++<my.length-1 && curNode.data!=value){
            curNode = curNode.next;
        }
        if(i==my.length)
            return -1;
        return i;
    };
    
    DoublyLinkedList.prototype.lastIndexOf = function(value) {
        let my = internal(this);
        let curNode = my.tail;
        let i=my.length-1;
        while(i-->-1 && curNode.data!=value){
            curNode = curNode.prev;
            if(curNode == null)
                return -1;
        }
        
        return i+1;
    };
    
    DoublyLinkedList.prototype.getLength = function(){
        let my = internal(this);
        return my.length;
    };
    
    DoublyLinkedList.prototype.swap = function(a,b) {
        let my = internal(this);
        if(a<0 || a>my.length || b<0 || b>my.length)
            throw "Index out of bounds";
        
        if(a==b)
            return;
        
        if(b<a){
            let tmp = b;
            b = a;
            a = tmp;
        }
        
        let front = {el: my.head, i:0};
        let back = {el: my.tail, i:my.length-1};
        
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
        let my = internal(this);
        a|=0; // if null, set 0;
        
        if(b==null)
            b=my.length-1;
        if(a>b || a<0 || b<=0 || a>=my.length || b>=my.length)
            throw "Index out of bounds";
        if(a==b)
            return;
        
        let front = {el: my.head, i:0};
        let back = {el: my.tail, i:my.length-1};
        
        while(front.i < a){
            front.el = front.el.next;
            front.i ++;
        }
        while(back.i > b){
            back.el = back.el.prev;
            back.i --;
        }
        
        // Swap each data pair.
        while(front.i < back.i){
            let temp = front.el.data;
            front.el.data = back.el.data;
            back.el.data = temp;
            
            front.i++;
            back.i--;
            front.el = front.el.next;
            back.el = back.el.prev;
        }
    };

    DoublyLinkedList.prototype.insertAt = function(index, value) {
        let my = internal(this);
        if(index > my.length || index < 0)
            throw "Index out of bounds";
        
        my.length += 1;
        // Make new
        if(my.head == null){
            my.head = new Node(value);
            my.tail = my.head;
            return;
        }
        
        let curNode = my.head;
        let tempNode = new Node(value);
        
        // Insert beginning.
        if(index == 0){
            tempNode.next = my.head;
            my.head = tempNode;
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
            my.tail = tempNode;
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
        let my = internal(this);
        if(index >= my.length || index < 0 || my.length == 0)
            return undefined;
            // throw "Index out of bounds";
        
        my.length -= 1;
        
        if(my.length == 0){
            my.head = null;
            my.tail = null;
            return; // No references left.
        }
        
        let curNode = my.head;
        if(index == 0){
            my.head = curNode.next; // Garbage collector should get it.
            my.head.prev = null;
            return;
        }
        
        for(let i=0; i<index-1; i++){
            curNode = curNode.next;
        }
        
        // curNode points to previous.
        curNode.next = curNode.next.next;
        
        if(curNode.next == null)
            my.tail = curNode;
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
        let my = internal(this);
        if(index >= my.length || index < 0 || my.length == 0)
            throw "Index out of bounds";
        
        let curNode = my.head;
        
        for(let i=0; i<index; i++){
            curNode = curNode.next;
        }
        
        curNode.data = value;
    };
    
    DoublyLinkedList.prototype.sort = function(compareFunction) {
        let my = internal(this);
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
                let asrc = sortMe[pairIndex], bsrc = sortMe[pairIndex+1] || [];
                sortedArray[pairIndex/2] = [];
                let putbox = sortedArray[pairIndex/2];
                    
                let alim = asrc.length, blim = bsrc.length;
                
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
        let curNode = my.head;
        for(let i=0, len=my.length; i<len; i++){
            initList.push([curNode.data]);
            curNode = curNode.next;
        }
        let sorted = mergeSortArray(initList)[0];
        let result = new DoublyLinkedList();
        for(let i=0, len=sorted.length; i<len; i++){
            result.push_back(sorted[i]);
        }
        my.head = internal(result).head;
        my.tail = internal(result).tail;
    };
    
    DoublyLinkedList.prototype.sublist = function(index,len) {
        let my = internal(this);
        index |= 0;
        if(len == null)
            len = my.length - index;
        if(index < 0 || index > my.length)
            throw "Index out of bounds";
        var retList = new DoublyLinkedList();
        
        let curNode = my.head;
        for(let i=0; i<index; i++){
            curNode = curNode.next;
        }
        
        for(let i=0; i<len; i++){
            retList.push_back(curNode.data);
            curNode = curNode.next;
        }
        
        return retList;
    };
    
    DoublyLinkedList.prototype.copy = function() {
        return this.sublist(0, internal(this).length);
    };
    
    DoublyLinkedList.prototype.getValueAt = function(index){
        let my = internal(this);
        if(index >= my.length || index < 0)
            return null;
        
        let curNode = my.head;
        for(let i=0; i<index; i++){
            curNode = curNode.next;
        }
        return curNode.data;
    };
    
    DoublyLinkedList.prototype.toArray = function(){
        let my = internal(this);
        let curNode = my.head;
        let temp = [];
        for(let i=0, len=my.length; i<len; i++){
            temp.push(curNode.data);
            curNode = curNode.next;
        }
        return temp;
    };
    
    DoublyLinkedList.prototype.toArrayBackwards = function(){
        let my = internal(this);
        let curNode = my.tail;
        let temp = [];
        for(let i=0, len=my.length; i<len; i++){
            temp.push(curNode.data);
            curNode = curNode.prev;
        }
        return temp;
    };
    
    if(window.createjs == null && window.strangl == null){
        return DoublyLinkedList;
    }
    
    // Here begins the graphical stuff:
    let sgl = strangl;
    let cjs = createjs;
    let arrow = [ new sgl.Line({x:0, y:0, z:0},{x:1, y:0, z:0},"black",1),
                new sgl.Line({x:.8, y:-.1, z:0},{x:1, y:0, z:0},"black",1) ];
    let databox = {box: new sgl.Polygon([{x:0, y:0, z:0},{x:0,y:1,z:0},{x:1,y:1,z:0},{x:1,y:0,z:0}],
                    null, 1, [0xff,0x7f,0x00,.5], {renderWire:true}),
                    prevpt: new sgl.Vertex(0, .33, 0),
                    nextpt: new sgl.Vertex(1, .67, 0)
                    };
                
    DoublyLinkedList.prototype.visualizeChain = function(clip, gc){
        let my = internal(this);
        let curNode = my.head;
        
        let renderList = []; // When transforms are done, push here.
        clip.removeAllChildren();
        gc.graphics.clear();
        
        for(let i=0, len=my.length; i<len; i++){
            // Transform box:
            let curbox = databox.box.copy().scale(20).translate(i*30,0,0);
            renderList.push(curbox);
            // Next Arrow:
            let nextContact = databox.nextpt.copy().scale(20).translate(i*30,0,0);
            renderList.push(arrow[0].copy().scale(10).translate(nextContact.x, nextContact.y, 0));
            renderList.push(arrow[1].copy().scale(10).translate(nextContact.x, nextContact.y, 0));
            // Previous Arrow:
            let prevContact = databox.prevpt.copy().scale(20).translate(i*30,0,0);
            renderList.push(arrow[0].copy().rotZ(Math.PI).scale(10).translate(prevContact.x, prevContact.y, 0));
            renderList.push(arrow[1].copy().rotZ(Math.PI).scale(10).translate(prevContact.x, prevContact.y, 0));
            // Data:
            let data = new cjs.Text(curNode.data, "15px Arial", "#0000ff");
            data.x = i*30+15;
            data.y = 0;
            data.rotation = 90;
            clip.addChild(data);
            
            curNode = curNode.next;
        }
        
        for(let i=0, len=renderList.length; i<len; i++){
            renderList[i].render(gc.graphics);
        }
    };
    
    return DoublyLinkedList;
})();
