let BinarySearchTree = (function(val){
    // Private member access
    let map = new WeakMap();

    let internal = function(object){
        if(!map.has(object))
            map.set(object, {});
        return map.get(object);
    }

    let Node = function(data){
        this.data = data;
        this.children = [null, null];  // Houses other nodes
    };
        
    function BinarySearchTree(val){
        let ns = internal(this);
        if(val == null){
            ns.root = null;
        }
        else{
            ns.root = new Node(val);
        }
    }
    
    BinarySearchTree.prototype.insertKey = function(val) {
        let ns = internal(this);
        if(ns.root == null){
            ns.root = new Node(val);
            return;
        }
        
        let curNode = ns.root;
        function insert(val,node,which){
            if(node.children[which] == null){
                node.children[which] = new Node(val);
                return;
            }
            
            let curNode = node.children[which];
            if(val <= curNode.data)
                insert(val, curNode, 0);
            else
                insert(val, curNode, 1);
        }
        
        if(val <= curNode.data)
            insert(val, curNode, 0);
        else
            insert(val, curNode, 1);
    };
    
    BinarySearchTree.prototype.toArray = function() {
        let ns = internal(this);
        let bfArray = [ns.root];
        let retArray = [ns.root.data];
        let i=0;
        
        while(i < bfsArray.length){
            let curNode = bfArray[i++];  // queue 'pop'
            let pushArr = [];
            
            if(curNode.children[0] != null){
                bfArray.push(curNode.children[0]);
            }
            if(curNode.children[1] != null){
                bfArray.push(curNode.children[1]);
            }
        }
    };
    
    BinarySearchTree.prototype.toArrayPreO = function() {
        let ns = internal(this);
        let retArray = [];
        let curNode = ns.root;
        
        function PreO(curNode){
            let retArray = []
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
    
    BinarySearchTree.prototype.toArrayInO = function() {
        let ns = internal(this);
        let retArray = [];
        let curNode = ns.root;
        
        function InO(curNode){
            let retArray = []
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
    
    BinarySearchTree.prototype.toArrayPostO = function() {
        let ns = internal(this);
        let retArray = [];
        let curNode = ns.root;
        
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
    
    return BinarySearchTree;
})();
