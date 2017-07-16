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

Didn't your C++/Java profs teach you about access modifiers? Forsooth! Here, you will find that I correctly *(I hope)* implemented each of these.

That said, are a lot of these useful? Not really. Again, it's just for fun and practice. You can try these out for yourself. Each data structure is contained in its own .js file for your convenience. Also, you can clone the repo and open `index.html`. Then, open your console and interact from there. Have fun.
