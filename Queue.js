let Queue = (function(size, val){
    let map = new WeakMap();
    
    let internal = function(object){
        if(!map.has(object))
            map.set(object, {});
        return map.get(object);
    };
    
    function Queue(size, val){
        let my=internal(this);
        
        if(size == null){
            my.dynamicArray = []; // Holds the data
            my.headCounter = 0;       // The head of the queue
        } else {
            my.dynamicArray = [];
            my.headCounter = size;
            for(let i=0; i<size; i++){
                my.dynamicArray.push(val);
            }
        }
        
        Object.defineProperty(this, "length", {get: function(){return my.dynamicArray.length - my.headCounter}});
    };
    
    Queue.prototype.isEmpty = function() {
        return (internal(this).dynamicArray.length==0);
    };
    
    Queue.prototype.enqueue = function(val) {
        internal(this).dynamicArray.push(val);
    };
    
    Queue.prototype.push = Queue.prototype.enqueue;  // Alias
    
    Queue.prototype.dequeue = function() {
        let my = internal(this);
        if(my.length == 0)
            return;
        
        let retVal = my.dynamicArray[my.headCounter];
        
        my.headCounter += 1;
        
        if(my.headCounter * 2 >= my.dynamicArray.length){
            my.dynamicArray = my.dynamicArray.slice(my.headCounter);
            my.headCounter = 0;
        }
        
        return retVal;
    };
    
    Queue.prototype.pop = Queue.prototype.dequeue;
    
    Queue.prototype.front = function() {
        let my = internal(this);
        return my.dynamicArray[my.headCounter];
    };
    
    Queue.prototype.peek = Queue.prototype.peekFront = Queue.prototype.front;
    
    Queue.prototype.copy = function() {
        let my = internal(this);
        let retQ = new Queue();
        let their = internal(retQ);
        for(let i=my.headCounter, len=my.dynamicArray.length-1-my.headCounter; i<len; i++){
            their.dynamicArray.push(my.dynamicArray[i]);
        }
        
        return retQ;
    };
    
    Queue.prototype.toArray = function() {
        let my = internal(this);
        let retArray = [];
        
        for(let i=my.headCounter, len=my.dynamicArray.length; i<len; i++){
            retArray.push(my.dynamicArray[i]);
        }
        
        return retArray;
    };
    
    
    let sgl = strangl;
    let cjs = createjs;
    let square = new sgl.Polygon([{x:0, y:0, z:0},{x:0,y:1,z:0},{x:1,y:1,z:0},{x:1,y:0,z:0}],
                    "black", 1, [0xff,0x7f,0x00,.5], {renderWire:true});
    Queue.prototype.visualizeQueue = function(gc) {
        let my = internal(this);
        
        let renderList = [];
        // clip.removeAllChildren();
        gc.graphics.clear();
        
        for(let i=my.headCounter, len=my.dynamicArray.length; i<len; i++){
            let copySq = square.copy().scale(60).rotX(Math.PI*.40).rotY(Math.PI/6).translate(100,680-8*(len-i),0.1*i).doOrtho(1);
            let colorkey = Math.floor(my.dynamicArray[i]);
            copySq.fillcolor = [Math.floor(Math.abs(Math.sin(colorkey))*255), Math.floor(Math.abs(Math.cos(colorkey))*255), Math.floor(Math.abs(Math.sin(2*colorkey)*Math.cos(3*colorkey))*255), 1];
            renderList.push(copySq);
        }
        
        renderList.sort(sgl.centroidSort);
        for(let i=0, len=renderList.length; i<len; i++){
            renderList[i].render(gc.graphics);
        }
    };
    
    return Queue;
})();
