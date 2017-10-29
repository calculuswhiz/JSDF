let AVLTree = (function(val){
    // Private member access
    let map = new WeakMap();

    let internal = function(object){
        if(!map.has(object))
            map.set(object, {});
        return map.get(object);
    };

    let Node = function(data){
        this.data = data;
        this.children = [null, null];  // Houses other nodes
        this.balanceFactor = 0;
    };
        
    function AVLTree(val){
        let my = internal(this);
        if(val == null){
            my.root = null;
            my.size = 0;
        }
        else{
            my.root = new Node(val);
            my.size = 1;
        }
        
        Object.defineProperty(this,"size", {get: function(){return my.size}});
    }
    
    
    // Node rotation commands (private):
    function rotL(array,parentIndex,childIndex){
        let X = array[parentIndex];
        let Z = array[childIndex];
        X.children[1] = Z.children[0]; // X's right child
        Z.children[0] = X; // Z's left child
        if(Z.balanceFactor == 0){ // Rebalance.
            X.balanceFactor = 1;
            Z.balanceFactor = -1;
        } else {
            X.balanceFactor = 0;
            Z.balanceFactor = 0;
        }
        array[parentIndex] = Z; // Simple replace in path array to point the grandparent to the proper node. We won't need the childIndex anymore.
        return Z;
    }
    function rotR(array,parentIndex,childIndex){
        let X = array[parentIndex];
        let Z = array[childIndex];
        X.children[0] = Z.children[1]; // X's left child
        Z.children[1] = X; // Z's right child
        if(Z.balanceFactor == 0){ // Rebalance.
            X.balanceFactor = -1;
            Z.balanceFactor = 1;
        } else {
            X.balanceFactor = 0;
            Z.balanceFactor = 0;
        }
        array[parentIndex] = Z; // Simple replace in path array to point the grandparent to the proper node. We won't need the childIndex anymore.
        return Z;
    }
    function rotLR(array,parentIndex,childIndex){
        let X = array[parentIndex];
        let Z = array[childIndex];
        let Y = Z.children[1];
        
        // First rotation:
        Z.children[1] = Y.children[0];
        Y.children[0] = Z;
        
        // Second rotation:
        X.children[0] = Y.children[1];
        Y.children[1] = X;
        
        // Balance adjustments:
        if(Y.balanceFactor < 0){
            X.balanceFactor = 1;
            Z.balanceFactor = 0;
        } else if (Y.balanceFactor == 0) {
            X.balanceFactor = 0;
            Z.balanceFactor = 0;
        } else {
            X.balanceFactor = 0;
            Z.balanceFactor = -1;
        }
        Y.balanceFactor = 0;
        
        array[parentIndex] = Y;
        return Y;
        
    }
    function rotRL(array,parentIndex,childIndex){
        let X = array[parentIndex];
        let Z = array[childIndex];
        let Y = Z.children[0];
        
        // First rotation:
        Z.children[0] = Y.children[1];
        Y.children[1] = Z;
        
        // Second rotation:
        X.children[1] = Y.children[0];
        Y.children[0] = X;
        
        // Balance adjustments:
        if(Y.balanceFactor > 0){
            X.balanceFactor = -1;
            Z.balanceFactor = 0;
        } else if (Y.balanceFactor == 0) {
            X.balanceFactor = 0;
            Z.balanceFactor = 0;
        } else {
            X.balanceFactor = 0;
            Z.balanceFactor = 1;
        }
        Y.balanceFactor = 0;
        
        array[parentIndex] = Y;
        return Y;
    }
    
    // AVL tree
    AVLTree.prototype.insertKeyBalanced = function(val) {
        let my = internal(this);
        
        // Empty. Fist node:
        if(my.root == null){
            my.root = new Node(val);
            my.size += 1;
            return;
        }
        
        let curNode = my.root;
        let pathToNode = [curNode];
        
        let inserted = true;
        // Helper recursive function:
        function insert(val,node,which){
            if(node.children[which] == null){
                node.children[which] = new Node(val);
                pathToNode.push(node.children[which]);
                return;
            }
            
            let curNode = node.children[which];   // Focus to current node
            pathToNode.push(curNode);              // Push it onto chain Array
            
            if(val < curNode.data)
                insert(val, curNode, 0);
            else if(val > curNode.data)
                insert(val, curNode, 1);
            else
                inserted = false;
        }
        
        // Only store unique keys.
        if(val < curNode.data)
            insert(val, curNode, 0);
        else if(val > curNode.data)
            insert(val, curNode, 1);
        else
            return;
        
        if(!inserted)
            return;
        
        my.size += 1;
        
        // Check for balance. Last element is inserted node.
        // i - leaf
        // i-1 - parent
        // i-2 - grandparent
        for(let i=pathToNode.length-1; i>0; i--){
            let grandparent=null, postRotated=null;
            let parent = pathToNode[i-1];
            if(parent.children[1] == pathToNode[i]){ // Right child
                if(parent.balanceFactor > 0){  // Right heavy
                    grandparent = pathToNode[i-2];
                    if(pathToNode[i].balanceFactor < 0){
                        postRotated = rotRL(pathToNode, i-1, i);
                    } else {
                        postRotated = rotL(pathToNode, i-1, i);
                    }
                } else if(parent.balanceFactor < 0) {
                    parent.balanceFactor = 0;
                    break;      // Height has NOT changed. We're done here.
                } else {
                    parent.balanceFactor = 1;
                    continue; // Height has changed, need to know if we need to adjust above.
                }
            } else {                                    // Left child
                if(parent.balanceFactor < 0) { // Left heavy
                    grandparent = pathToNode[i-2];
                    if(pathToNode[i].balanceFactor > 0){
                        postRotated = rotLR(pathToNode, i-1, i);
                    } else {
                        postRotated = rotR(pathToNode, i-1, i);
                    }
                } else if(parent.balanceFactor > 0) {
                    parent.balanceFactor = 0;
                    break;
                } else {
                    parent.balanceFactor = -1;
                    continue;
                }
            }
            
            // After rotation:
            if(grandparent != null) {
                if(grandparent.children[0] == parent){ // Left
                    grandparent.children[0] = postRotated;
                } else {
                    grandparent.children[1] = postRotated;
                }
                break;
            } else {
                if(postRotated != null)
                    my.root = postRotated;
                break;
            }
        }
    };
    
    AVLTree.prototype.removeKeyBalanced = function(val) {
        let my = internal(this);
        let curNode = my.root;
        if(curNode == null){
            return;
        }
        
        if(curNode.children[0] == null && curNode.children[1] == null){
            my.root = null;
            my.size = 0;
            return;
        }
        
        let pathToNode = [curNode];
        
        function findMin(node){
            let curNode = node;
            while(curNode.children[0] != null){
                curNode = curNode.children[0];
            }
            return curNode;
        }
        
        let removed = true;
        function remove(val, node, whichChild){
            let curNode = node.children[whichChild];
            
            pathToNode.push(curNode);
            
            if(curNode == null){
                // Nothing to remove:
                removed = false;
                return;
            }
            
            if(curNode.data > val){
                remove(val, curNode, 0);
            } else if (curNode.data < val){
                remove(val, curNode, 1);
            } else {
                if(curNode.children[0]!=null && curNode.children[1]!=null){ // Both children present
                    let rightMinNode = findMin(curNode.children[1]);
                    curNode.data = rightMinNode.data;
                    remove(curNode.data, curNode, 1);
                } else if (curNode.children[0] != null){                    // Left child present
                    curNode.data = curNode.children[0].data;
                    curNode.children[1] = curNode.children[0].children[1];
                    curNode.children[0] = curNode.children[0].children[0];
                } else if (curNode.children[1] != null){                    // Right child present
                    curNode.data = curNode.children[1].data;
                    curNode.children[0] = curNode.children[1].children[0];
                    curNode.children[1] = curNode.children[1].children[1];
                } else {                                                    // No children present
                    node.children[whichChild] = null;
                }
            }
        }
        
        // Base case:
        if(curNode.data > val){
            remove(val, curNode, 0);
        } else if (curNode.data < val){
            remove(val, curNode, 1);
        } else { // Cheats activate:
            let tempParent = {children:[curNode, null]};
            remove(val, tempParent, 0);
            return;
        }
        
        if(!removed)
            return;
        
        my.size -= 1;
        
        let lasti = pathToNode.length-1;
        let last = pathToNode[lasti];
        if(last.children[0] === null && last.children[1] === null)
            last.balanceFactor = 0;
        
        // Check for balance. Last element is deleted node. Will be gc'd after leaving scope. We still need it for now.
        // i - current node
        // i-1 - parent
        // i-2 - grandparent
        for(let i=lasti; i>0; i--){
            let parent = pathToNode[i-1]; // X
            let grandparent = pathToNode[i-2]; // G
            let postRotated = null;
            let bal;
            
            if(pathToNode[i].data < parent.data){ // Left side
                if(parent.balanceFactor > 0){ // Right heavy parent
                    pathToNode[i] = parent.children[1];
                    bal = pathToNode[i].balanceFactor;
                    if(bal < 0)
                        postRotated = rotRL(pathToNode, i-1, i);
                    else
                        postRotated = rotL(pathToNode, i-1, i);
                } else {
                    if(parent.balanceFactor == 0){
                        parent.balanceFactor = 1;
                        break;
                    }
                    postRotated = parent;
                    postRotated.balanceFactor = 0;
                    continue;
                }
            } else {
                if(parent.balanceFactor < 0){ // Left heavy parent
                    pathToNode[i] = parent.children[0];
                    bal = pathToNode[i].balanceFactor;
                    if(bal > 0)
                        postRotated = rotLR(pathToNode, i-1, i);
                    else
                        postRotated = rotR(pathToNode, i-1, i);
                } else {
                    if(parent.balanceFactor == 0){
                        parent.balanceFactor = -1;
                        break;
                    }
                    postRotated = parent;
                    postRotated.balanceFactor = 0;
                    continue;
                }
            }
            
            // After rotation:
            if(grandparent != null) {
                if(grandparent.children[0] == parent){ // Left
                    grandparent.children[0] = postRotated;
                } else {
                    grandparent.children[1] = postRotated;
                }
                if(bal == 0)
                    break;
            } else {
                if(postRotated != null)
                    my.root = postRotated;
                // break;
            }
        }
    };
    
    AVLTree.prototype.searchKey = function(val) {
        let my = internal(this);
        let curNode = my.root;
        
        while(curNode != null){
            if(val < curNode.data)
                curNode = curNode.children[0];
            else if(val > curNode.data)
                curNode = curNode.children[1];
            else
                return true;
        }
        return false;
    };
    
    // Pop functions:
    AVLTree.prototype.removeKeyAt = function(n) {
        let my = internal(this);
        let curNode = my.root;
        
        if(n >= my.size)
            return;
        
        let shouldStop = false;
        
        function InO(curNode){
            let retVal;
            if(curNode.children[0] != null)
                retVal = InO(curNode.children[0]);
            if(shouldStop)
                return retVal;
            if(--n < 0){
                shouldStop = true;
                return curNode.data;
            }
            if(curNode.children[1] != null)
                retVal = InO(curNode.children[1]);
            
            return retVal;
        }
        
        let retVal = InO(curNode);
        this.removeKeyBalanced(retVal);
        
        return retVal;
    };
    
    AVLTree.prototype.popMinKey = function() {
        let my = internal(this);
        let curNode = my.root;
        
        if(curNode == null)
            return;
        
        while(curNode.children[0] != null){
            curNode = curNode.children[0]; // Optimize me.
        }
        
        let retVal = curNode.data;
        this.removeKeyBalanced(retVal);
        
        return retVal;
    };
    
    AVLTree.prototype.popMaxKey = function() {
        let my = internal(this);
        let curNode = my.root;
        
        if(curNode == null)
            return;
        
        while(curNode.children[1] != null){
            curNode = curNode.children[1];
        }
        
        let retVal = curNode.data;
        this.removeKeyBalanced(retVal);
        
        return curNode.data;
    };
    
    // Retrieval functions:
    AVLTree.prototype.getKeyAt = function(n) {
        let my = internal(this);
        let curNode = my.root;
        
        if(n >= my.size)
            return;
        
        let shouldStop = false;
        
        function InO(curNode){
            let retVal;
            if(curNode.children[0] != null)
                retVal = InO(curNode.children[0]);
            if(shouldStop)
                return retVal;
            if(--n < 0){
                shouldStop = true;
                return curNode.data;
            }
            if(curNode.children[1] != null)
                retVal = InO(curNode.children[1]);
            
            return retVal;
        }
        
        return InO(curNode);
    };
    
    AVLTree.prototype.getMinKey = function() {
        let my = internal(this);
        let curNode = my.root;
        
        if(curNode == null)
            return;
        
        while(curNode.children[0] != null){
            curNode = curNode.children[0];
        }
        
        return curNode.data;
    };
    
    AVLTree.prototype.getMaxKey = function() {
        let my = internal(this);
        let curNode = my.root;
        
        if(curNode == null)
            return;
        
        while(curNode.children[1] != null){
            curNode = curNode.children[1];
        }
        
        return curNode.data;
    };
    
    AVLTree.prototype.toArray = function() {
        let my = internal(this);
        let bfArray = [my.root];
        let retArray = [my.root.data];
        let i=0;
        
        while(i < bfArray.length){
            let curNode = bfArray[i++];  // queue 'pop'
            let pushArr = [];
            
            if(curNode.children[0] != null){
                bfArray.push(curNode.children[0]);
                retArray.push(curNode.children[0].data);
            }
            if(curNode.children[1] != null){
                bfArray.push(curNode.children[1]);
                retArray.push(curNode.children[1].data);
            }
        }
        return retArray;
    };
    
    AVLTree.prototype.toArrayPreO = function() {
        let my = internal(this);
        let retArray = [];
        let curNode = my.root;
        
        function PreO(curNode){
            let retArray = [];
            retArray.push(curNode.data);
            if(curNode.children[0] != null)
                retArray = retArray.concat(PreO(curNode.children[0]));
            if(curNode.children[1] != null)
                retArray = retArray.concat(PreO(curNode.children[1]));
            
            return retArray;
        }
        
        retArray.push(curNode.data);
        if(curNode.children[0] != null)
            retArray = retArray.concat(PreO(curNode.children[0]));
        if(curNode.children[1] != null)
            retArray = retArray.concat(PreO(curNode.children[1]));
        
        return retArray;
    };
    
    AVLTree.prototype.toArrayInO = function() {
        let my = internal(this);
        let retArray = [];
        let curNode = my.root;
        
        function InO(curNode){
            let retArray = [];
            if(curNode.children[0] != null)
                retArray = retArray.concat(InO(curNode.children[0]));
            retArray.push(curNode.data);
            if(curNode.children[1] != null)
                retArray = retArray.concat(InO(curNode.children[1]));
            
            return retArray;
        }
        
        if(curNode.children[0] != null)
            retArray = retArray.concat(InO(curNode.children[0]));
        retArray.push(curNode.data);
        if(curNode.children[1] != null)
            retArray = retArray.concat(InO(curNode.children[1]));
        
        return retArray;
    };
    
    AVLTree.prototype.toArrayPostO = function() {
        let my = internal(this);
        let retArray = [];
        let curNode = my.root;
        
        function PostO(curNode){
            let retArray = [];
            if(curNode.children[0] != null)
                retArray = retArray.concat(PostO(curNode.children[0]));
            if(curNode.children[1] != null)
                retArray = retArray.concat(PostO(curNode.children[1]));
            retArray.push(curNode.data);
            
            return retArray;
        }
        
        if(curNode.children[0] != null)
            retArray = retArray.concat(PostO(curNode.children[0]));
        if(curNode.children[1] != null)
            retArray = retArray.concat(PostO(curNode.children[1]));
        retArray.push(curNode.data);
        
        return retArray;
    };
    
    AVLTree.prototype.copy = function() {
        let my = internal(this);
        if(my.root == null)
            return null;
        
        let destinationTree = new AVLTree(my.root.data);
        let their = internal(destinationTree);
        their.size = my.size;
        
        let myNode = my.root, theirNode = their.root;
        
        function copyNode(src, dst){
            if(src.children[0] != null){
                dst.children[0] = new Node(src.children[0].data);
                copyNode(src.children[0], dst.children[0]);
            }
            if(src.children[1] != null){
                dst.children[1] = new Node(src.children[1].data);
                copyNode(src.children[1], dst.children[1]);
            }
        }
        
        copyNode(myNode, theirNode);
        
        return destinationTree;
    };
    
    if(window.createjs == null && window.strangl == null){
        return AVLTree;
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
                
    AVLTree.prototype.visualizeTree = function(clip, gc){
        let my = internal(this);
        
        let renderList = []; // When transforms are done, push here.
        clip.removeAllChildren();
        gc.graphics.clear();
        if(my.root == null)
            return;
        
        function drawChild(node, child, pos, layer, layerFactor){
            if(node.children[child] == null)
                return;
            
            let ypos = layer*15*4;
            
            // Box:
            if(child == 0){
                renderList.push(databox.box.copy().scale(20).translate(pos - layerFactor/2,ypos,0));
                renderList.push(new sgl.Line({x:pos, y:ypos-15*4, z:0}, {x:pos - layerFactor/2, y:ypos, z:0}, "black", 1));
            }
            else{
                renderList.push(databox.box.copy().scale(20).translate(pos + layerFactor/2,ypos,0));
                renderList.push(new sgl.Line({x:pos, y:ypos-15*4, z:0}, {x:pos + layerFactor/2, y:ypos, z:0}, "black", 1));
            }
            // Data:
            // let data = new cjs.Text(node.children[child].data, "15px Arial", "#0000ff");
            let data = new cjs.Text(node.children[child].balanceFactor+":"+node.children[child].data, "15px Arial", "#0000ff");
            if(child == 0)
                data.x = pos - layerFactor/2+15;
            else
                data.x = pos + layerFactor/2+15;
            data.y = ypos;
            data.rotation = 90;
            clip.addChild(data);
            
            drawChild(node.children[child], 0, data.x-15, layer +1, layerFactor / 2);
            drawChild(node.children[child], 1, data.x-15, layer +1, layerFactor / 2);
        }
        
        // Visualize root:
        // Box:
        let cWidth = canvas.width;
        renderList.push(databox.box.copy().scale(20).translate(cWidth/2,0,0));
        // Data:
        let data = new cjs.Text(my.root.balanceFactor+":"+my.root.data, "15px Arial", "#0000ff");
        data.x = cWidth/2+15;
        data.y = 0;
        data.rotation = 90;
        clip.addChild(data);
        
        drawChild(my.root, 0, cWidth/2, 1, cWidth/2);
        drawChild(my.root, 1, cWidth/2, 1, cWidth/2);
        
        for(let i=0, len=renderList.length; i<len; i++){
            renderList[i].render(gc.graphics);
        }
    };
    
    return AVLTree;
})();
