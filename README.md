# JSDF
**J**ava**S**cript **D**ata-structures **F**un (No relation to the Japanese Self-Defense Force)

## Why?
In an effort to sharpen my JavaScript skills and keep up my technical interview skills after being stuck in a dead-end job for the next couple years, I started this project for fun. Here, you'll find several data structures implemented in JavaScript for your up-to-date browser. Has it been done before by other folks out there? Yeah, but I don't think most of them keep security in mind (nobody I could find did). For example, in many implementations I found for linked lists (an interviewer favorite, I'm told), the head of the list was accessible by a `this.head`. Don't you see the problem here? What if I did this:

```
let a=new LinkedList("q");
a.push_back(1);
a.push_back(2);
a.push_back(3);
a.head.next.next = a.head.next;  // Bad!
console.log(a.toArray());  // Uh, oh! Infinite loop!
```

Didn't your C++/Java profs teach you about access modifiers? Forsooth! Here, I hope to demonstrate secure and correct code by using a method I found online:

```
// Define an object via closure:
let MyClass = (function(params){
    // Private member access
    let map = new WeakMap();  // Holds the private properties of the object.

    // Allows coder to access the Weakmap by passing the object. Returns that object's Weakmap and thus allows access to internal properties.
    let internal = function(object){
        if(!map.has(object))
            map.set(object, {});
        return map.get(object);
    }
    
    // Constructor example:
    let MyClass = function(params){
        let my = internal(this);    // Cache the properties.
        my.size = params.size;
        
        // Read only property here:
        Object.defineProperty(this,"size", {get: function(){return my.size}});
    };
    
    MyClass.prototype.myFunction = function(){
        // Code here
    };
    
    return MyClass; // Replace closure with actual constructor. Gotta love JavaScript.
})(); // Immediately execute to replace.
```

This effectively implements private member access using the prototype. (Private member access can be implemented much more simply without using the prototype, but that can take up a lot more space than needed.) This also prevents a malicious user from coming in and adding a prototype function to access private functions. Remember that `internal` is local to the scope of the constructor closure.

Things that didn't work:
------------------------
The method described on [Douglas Crockford's website](http://javascript.crockford.com/private.html). This method is also described in *Javascript: The Good Parts* by the same author in 2008. Sorry, Mr. Crockford, I respect your work and your expertise, but that didn't quite make the cut. Here's me attempting the same thing from above:
```
// Constructor:
let MyClass = function(params){
    // Private members:
    let size = 0;
    let myFunc = function(){
        // Do stuff...
    };
    
    // Public stuff:
    MyClass.prototype.getSize = function(){
        return size;
    };
    
    MyClass.prototype.setSize = function(val){
        size = val;
    };
};

let a = new MyClass();
let b = new MyClass();
console.log("a:"+a.getSize(), "b:"+b.getSize());  // a:0 b:0
a.setSize(1);  // Should only set size in a to 1, but...
console.log("a:"+a.getSize(), "b:"+b.getSize());  // a:1 b:1
```

And, yes, this can be remedied by changing the `MyClass.prototype`s above to `this`, but remember that this makes copies every time a new instance is created. Using the prototype, we don't have this problem, but it came with the problem described above. And, of course, you can't move the prototype method definitions outside the constructor either because then it has no access to `size`.

Interestingly, this kind of makes the intended private members `static` (as in C++) across all instances of the class. I think that could be very useful. In fact, I made use of this in the AVLtree's copy function. Internally, an AVLtree can access any other AVLtree's `internal` function.

Final remarks:
--------------
With all that said, are a lot of these useful? Not really. Actually, they may be a little because of the access modifiers. Again, it's just for fun and practice. You can try these out for yourself. Each data structure is contained in its own .js file for your convenience. Also, you can clone the repo and open `index.html`. Then, open your console and interact from there. I included a few demos as well. Have fun.
