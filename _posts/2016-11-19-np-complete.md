---
layout: post
title: Computation Theory Part 2 - Complexity Classes and NP Completeness
tags: [CS, Theory, Computation, Polynomial, Time, P, NP]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>
Welcome to part 2 of the Computation Theory series! In [the last post](http://danshiebler.com/2016-10-15-halting-problem), we discussed decidability and the halting problem. In this post we will talk about complexity classes. 

### Time Complexity 

If you're not used to reasoning about algorithms and their complexity, there is an enormous amount of great material that you can use to get started. 

- The MIT OCW Introduction to Algorithms [course](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/) is an great place to look if you want a pretty thorough introduction to algorithm design and analysis.
- Sanjay Dasgupta's [Algorithms](http://www.cse.iitd.ernet.in/~naveen/courses/CSL630/all.pdf) is my personal favorite algorithms book. It's a thin book, but excellent.

### The Complexity Class $$P$$

The concept of polynomial time is very simple - if an algorithm is $$O(f(n))$$ for some polynomial $$f(n)$$, then it is polynomial time. The complexity class $$P$$ contains all problems for which there exists a polynomial time algorithm to solve that problem. 

#### Example: Sorting

Consider the problem of sorting a list of numbers. This problem is obviously in $$P$$, because there exists algorithms, like selection sort or merge sort, which can sort a list of numbers in $$O(n^2)$$ or $$O(nlog(n))$$ time.

### Nondeterministic Polynomial time and the class $$NP$$

We say an algorithm is in the class $$NP$$ if it can be verified in polynomial time. That is, if we can write a program that checks whether a solution to the problem is correct in polynomial time.

- It's pretty easy to see that Sorting is in $$NP$$. We can easily write an algorithm to check that a list is sorted in linear time. 
- Another classic $$NP$$ problem is the Subset Sum problem. Say you have some set of numbers S (e.g. $$\{2,4,3\}$$). For some number $$n$$, you need to find a subset $$s$$ of $$S$$ such that the elements of $$s$$ sum to $$n$$. Given a subet $$s$$, we can just sum the numbers of $$s$$ in linear time to verify it as a solution.

As it happens, every problem in $$P$$ is also in $$NP$$. If we have an algorithm for solving a problem in polynomial time, we can just run that algorithm to verify a solution (the actual proof of this is a little bit more complex, involving certificates or nondeterministic turing machines, but we'll leave it at that).

However, the converse is not necessarily true. Take the Subset Sum problem for example. We showed above that it is in $$NP$$, but we don't know whether or not it is in P (an algorithm that enumerates every subset of $$S$$ and checks their sums would take exponential time). In order to get a better understanding of the relationship between P and $$NP$$, we need to talk about $$NP$$ Hardness, $$NP$$ Completeness and polynomial time reductions.

### $$NP$$ Hardness,  $$NP$$ Completeness
> Computer Science is the practice of transforming a problem from one that you don't know how to solve into one that you do 

Now there's an interesting structure to $$NP$$ problems that we haven't discussed yet. To understand it, we need to first learn about polynomial time reductions. 

#### Polynomial time reductions

We briefly touched on reductions last time, but to refresh your memory, a reduction from $$A$$ to $$B$$ is an algorithm that takes in the solution to problem $$B$$ and returns a solution to problem $$A$$. If we can develop a reduction like this, we say that $$A$$ *reduces* to $$B$$, or that solving $$B$$ solves $$A$$. If the reduction algorithm runs in polynomial time, then we say it is a polynomial time reduction

Notice that if we have a problem $$A$$, a polynomial time reduction from $$A$$ to $$B$$ and a polynomial time solution for $$B$$, then we have a polynomial time solution for $$A$$, because the sum of two polynomials is a polynomial. 

In code, this would look like this:

```[python]
def polynomial_time_solver_for_A(x):
  y = polynomial_time_solver_for_B(x)
  return polynomial_time_reduction(y)
```

> Note that the description above implies that B and A would need to each accept the same input x. This is not necessarily the case - it's all right for A and B to take inputs in different forms, as long as we can write a polynomial time algorithm that 'transforms' the input to A into an input for B.

#### $$NP$$ Hardness

We say that a problem A is $$NP$$ Hard if every single problem in $$NP$$ reduces to A in polynomial time. In other words, a problem that is $$NP$$-Hard is AT LEAST as hard as any problem in $$NP$$.

There are a lot of known $$NP$$ Hard problems, and assuming that you have at least one $$NP$$ hard problem $$A$$ [^footnote], it's not too difficult to show that a new problem is $$NP$$ hard. All you need to do is demonstrate that $$A$$ reduces to your new problem $$B$$ in polynomial time (if $$A$$ is "easier" than $$B$$,  all of the problems in $$NP$$ must be "easier" than $$B$$ as well).

All of this can get kind of confusing. Let's look at some simple code. 

Say that we have a problem $$C$$ that is in $$NP$$, and we have solvers for $$A$$ and $$B$$. Now $$A$$ is $$NP$$ hard, so we can write a function like this:

```[python]
def solution_to_C(x):
  y = solver_for_A(x)
  return polynomial_time_reduction_from_C_to_A(y)
```

Now if A reduces to B, then we can write a function that looks like this:

```[python]
def solution_to_A(x):
  y = solver_for_B(x)
  return polynomial_time_reduction_from_A_to_B(y)
```

So we can pretty easily write this function:

```[python]
def solution_to_C(x):
  y = solver_for_B(x)
  z  = polynomial_time_reduction_from_A_to_B(y)
  return polynomial_time_reduction_from_C_to_A(z)
```

#### NP Completeness

A problem is $$NP$$ complete if it is in $$NP$$ and it is $$NP$$ Hard. There's something really cool about $$NP$$ complete problems - each $$NP$$ complete problem is polynomial time reducible to each other $$NP$$ complete problem. So if you can solve one $$NP$$ complete problem in polynomial time, then you can solve every $$NP$$ problem in polynomial time. 

This is incredibly important, and it lies at the heart of the $$P$$ vs $$NP$$ question. If somebody, somewhere, figures out a polynomial time algorithm for any $$NP$$ complete problem, then we can use that algorithm (along with polynomial time reductions) to solve every problem in $$NP$$. If that happened, we would know that $$P=NP$$. So far, nobody has found such an algorithm or proven that one doesn't exist. 

### Other Resources

If you liked this post, then you'll probably love [this book](http://www.cin.ufpe.br/~jjss/Introcuction%20to%20Theory%20of%20computation%20by%20Micheal%20Sipser%20Ist%20Ed..pdf). It's an excellent resource, and it's filled with examples of reductions between $$NP$$-complete problems

[^footnote]: The fundamental $$NP$$-Hard/$$NP$$-Complete problem is $$SAT$$, or boolean satisfiability. The problem is: given some boolean formula $$B$$, is there an assignment of values that satisfies $$B$$. [Stephen Cook](https://en.wikipedia.org/wiki/Cook%E2%80%93Levin_theorem) proved that all $$NP$$ problems are polynomial-time reducible to $$SAT$$.
