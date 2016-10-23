---
layout: post
title: Computation Theory Part 1 - The Halting Problem
tags: [CS, Theory, Halting, Decidable, Decidability, P, NP]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

When you think about the most important fields of mathematics for a data scientist to know, you'll almost certainly name calculus, probability/statistics, and linear algebra. These fields form the underpinnings of the most popular data analysis, signal processing and machine learning techniques. But in my experience, I've found that there are a lot of other fields that are helpful to understand, such as the theory of computation.

As a data scientist, I write a lot of pretty complex programs. It can be challenging to reason about their behavior. I've found that having learned the basic tenants of the theory of computation has dramatically improved my ability to reason about the code that I write.

The study of the theory of computation involves reading and writing a lot of proofs about problems and programs. Now it's definitely possible for someone to write excellent code their entire life and never write a single proof. But I think that this is a shame. When you attempt to prove that an algorithm will work in all cases, you often discover bugs and flaws that would have been much more difficult to find later. In addition, proofs and code are actually very similar, and they complement and support one another. When you turn an idea into a program or a proof, you need to take a malleable and ambiguous concept in your mind and shape it into a concrete object. In doing so, you develop an extremely thorough understanding of the problem. I think that the exercise of reading and writing proofs has made me a stronger programmer. 

### Decidability

[Decidability](https://en.wikipedia.org/wiki/Decidability_(logic)) is a fancy word, but it expresses a pretty simple idea: if a problem is decidable, then we can write a computer program to solve it. More precisely, say that we have a decision problem $$D$$ (a yes/no question on some set of inputs). If $$D$$ is a decidable problem, there exists some algorithm $$A$$ such that $$A(x)$$ always produces the answer to $$D$$ for input $$x$$. 

This may seem like a pretty "out there" concept. After all, you've probably never been writing code and run into an undecidable problem. But as it turns out, some of the most important problems in computer science are undecidable. 

### The Halting Problem

The [halting problem](https://en.wikipedia.org/wiki/Decidability_(logic)) is probably the most famous undecidable problem. The problem is: given some computer program and some input to that program, determine whether the program will run forever or if it will terminate. 

Now the first time you read this problem, it doesn't seem that hard. We can look at the code? And the input!? And we don't even need to predict the output or how long it will take, just whether it will run forever?? All we need to do is look for loops...and nested loops...and recursion...and follow them...and pretty soon we'll just be going through the program, which isn't great news if the program may or may not run forever. 

Okay, so we're convinced this problem is pretty hard. But if we want to know whether it's really undecidable, then we'll have to write a proof. 

Like most decidability problems, the halting problem is easiest to solve with a proof by contradiction. That is, we assume that the problem is decidable, and then show that this leads us to a contradiction. 

Here's a sketch of the proof with python code:

Let's say that the halting problem is decidable. Then we can write this program:

```python
def does_halt(computer_program, input_to_program):
    """
    Args:
        computer_program (function): Any function
        input_to_program (anything): Any input
    Returns:
        True if computer_program(input_to_program) terminates and False
        if computer_program(input_to_program) runs forever. 
    """
    #code code code
```

Let's say mischievous friend sees our `does_halt` program, and he decides to write a program to trick it. 

```python
def friend_program(f):
    """
    Args:
        f (function): Any function
    """
    #Run the Halt program to see if f(f) will halt
    if does_halt(f, f):  #If f(f) will halt, then loop forever
        while True:
            pass
    else: #If f(f) won't halt, then halt
        return

```

Notice that `friend_program` is completely written out. If the `does_halt` program works, then `friend_program` will work. 

Now what happens when we run `friend_program(friend_program)`? There are two cases:

1. `friend_program(friend_program)` will halt. Then `does_halt(friend_program, friend_program)` will return `True`. However, because of line 7 in `friend_program`, then `friend_program(friend_program)` will run forever. So this is a contradiction. 

2. `friend_program(friend_program)` will run forever. Then `does_halt(friend_program, friend_program)` will return `False`. However, because of line 10 in `friend_program`, then `friend_program(friend_program)` will terminate. So this is a contradiction. 

Because we reach a contradiction no matter how we assume `friend_program(friend_program)` will behave, `does_halt` cannot exist and the halting problem is undecidable.

### Why does the halting problem matter?

As we'll see in the next post, a lot of computational theory involves "reductions", or algorithms that can transform a solution to one problem into a solution for another. 

Let's say we find a problem that the halting problem reduces to. That is, we can transform a solution to that problem into a solution to the halting problem. Then we know that problem is not decidable, because we've already proven the halting problem is undecidable. 

As it happens, the halting problem "reduces" to a lot of problems. This stack exchange [answer](http://cs.stackexchange.com/questions/32845/why-really-is-the-halting-problem-so-important) has a bunch of great examples. 

### Other Resources

If you liked this post, then you'll probably love [this book](http://www.cin.ufpe.br/~jjss/Introcuction%20to%20Theory%20of%20computation%20by%20Micheal%20Sipser%20Ist%20Ed..pdf). It's an excellent resource that's packed with examples and manages to effectively break down and explain some mind-bogglingly complex topics. 

Also, stay tuned! I'll have some more posts about computation theory coming soon. 
