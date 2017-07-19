let DisjointSetForest = (function(n){
    if(n<1)
        return;
    
    // Private member access
    let map = new WeakMap();

    let internal = function(object){
        if(!map.has(object))
            map.set(object, {});
        return map.get(object);
    }
    
    function DisjointSetForest(n){
        let ns = internal(this);
        ns.elements = new Array(n);
        for(let i=0; i<n; i++){
            ns.elements[i] = {rank:0, parent:i};
        }
    }
    
    DisjointSetForest.prototype.find = functino(index){
        let cache = this.elements[index];
        if(cache.parent != index){
            cache.parent = this.find(cache.parent); // Path compression.
        }
        return cache.parent;
    };
    
    DisjointSetForest.prototype.union = function(index1, index2) {
        var uRoot = this.find(index1);
        var vRoot = this.find(index2);
        
        if(uRoot == vRoot) // Same set
            return false;
        
        var cacheU = this.elements[uRoot];
        var cacheV = this.elements[vRoot];
        
        if(cacheU.rank < cacheV.rank)
            cacheU.parent = cacheV.parent;
        else if(cacheU.rank > cacheV.rank)
            cacheV.parent = cacheU.parent;
        else{ // Tie breaker
            cacheV.parent = cacheU.parent;
            cacheU.rank += 1;
        }
        return true;
    };
    
    return DisjointSetForest;
})();
