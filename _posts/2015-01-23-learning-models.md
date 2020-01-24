---
layout: post
title: Models of Learning
tags: [PAC, Computational, Learning, Theory]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

Machine Learning researchers can have a tough time agreeing on the best formulations for the problems they face. Even within the relatively well-defined setting of supervised learning, there are lots of ways to express the nature of the problem. At a very high level, we can express supervised learning as a meta-problem of the following form:

> Given access to some process that hints at how quantities of type $$\mathbf{X}$$ are related to quantities of type $$\mathbf{y}$$, construct a model that can accept an $$X$$ and return a $$y$$ in a way that is somewhat consistent with this process. 


## Classification

One of the broad subcategories of supervised learning is **classification**. In a classification problem, we assume that $$y$$ is an element of $$\{0,1\}$$. For simplicity, we will assume that $$X$$ is a vector in the space $$\mathbf{X}$$, which will either be $$\{0,1\}^n$$ or $$\mathbb{R}^n$$. There are a number of ways to characterize how $$X$$ is related to $$y$$, but the simplest is to just assume that there exists some joint probability distribution $$\mathcal{D}$$ over $$\mathbb{R}^n \times \{0,1\}$$ from which samples are drawn. Given an algorithm $$c$$ that can accept some $$X \in \mathbf{X}$$ and return some $$y \in \{0,1\}$$, we can quantify its **error** relative to the distribution $$\mathcal{D}$$ as $$Pr_{(X,y) \sim \mathcal{D}}(c(X) != y)$$. We will refer to such an algorithm as a **concept**.

Of course, there are many kinds of concepts, and even more ways to discover and construct them. We define a **concept class** $$\mathcal{C}$$ to be a family of concepts. Many algorithms for supervised learning are concept class-specific, and operate essentially as search algorithms that explore the concept class space in order to find a concept with an acceptably low error.

* A simple concept class for the case that $$\mathbf{X} = \{0,1\}^n$$ is the class of conjunctions, expressed as vectors in $$\{0,1\}^n$$. The prediction of the conjunction $$c \in \{0,1\}^n$$ on the vector $$x \in \{0,1\}^n$$ is
<!-- $$1$$ if $$\sum_{i=1}^n c_i*x_i = \sum_{i=1}^n c_i$$ and $$0$$ otherwise. -->
$$\begin{cases} 1 & \sum_{i=1}^n c_i*x_i = \sum_{i=1}^n c_i \\ 0 & \text{else} \end{cases}$$
* A simple concept class for the case that $$\mathbf{X} = \mathbb{R}^n$$ is the class of linear halfspaces, expressed as tuples $$(w \in \mathbb{R}^n, w_0\in\mathbb{R})$$ such that $$\|w\| = 1$$. The prediction of a linear halfspace on the vector $$x \in \mathbb{R}^n$$ is
$$\begin{cases} 1 & w_0 + \sum_{i=1}^n w_i*x_i >= 0 \\ 0 & \text{else} \end{cases}$$

One natural objective is to find the concept in the class with the minimum error relative to the distribution $$\mathcal{D}$$. However, this is usually too hard, and can be impossible in many cases (such as when the concept class is uncountably infinite). Instead, we will characterize the problem as one of finding a concept $$c \in \mathcal{C}$$ that has error less than $$\text{opt} + \epsilon$$, where $$\text{opt}$$ is the minimum error relative to the distribution $$\mathcal{D}$$ of any concept $$c \in \mathcal{C}$$ and $$\epsilon < 0.5$$ is a parameter to the algorithm. In order to find this concept, we will allow our search algorithm access to one or both of the following kinds of oracles:

* An **example oracle** $$EX(\mathcal{D})$$, that generates samples from $$\mathcal{D}$$
* A **membership oracle** $$MQ(\mathcal{D})$$ that accepts $$X \in \mathbf{X}$$ and generates a sample in $$y \in \{0,1\}$$ from $$\mathcal{D}$$ conditioned on $$X$$.

Generally we assume that both of these oracles are deterministic when conditioned on $$X$$. That is, for any $$X$$ the membership oracle will generate the same $$y$$ each time it is called with that $$X$$, and once we draw $$(X,1)$$ from the example oracle we will not draw $$(X,0)$$ (and vice versa). Since both of these oracles depend on the randomized process of drawing samples from $$\mathcal{D}$$, we generally allow our search algorithm to fail with some probability $$1-\delta$$, where $$\delta$$ is a parameter to the search algorithm. We will see examples of other oracles that do not explicitly rely on drawing samples from $$\mathcal{D}$$ later.

In the **Agnostic Learning** framework, we make no further assumptions about $$\mathcal{D}$$ and simply aim to solve the search problem described above. We typically allow our search algorithm to run longer or sample the oracles more times when $$\delta$$ and/or $$\epsilon$$ are small, the space $$\mathbf{X}$$ has more dimensions, and/or the concepts in $$\mathcal{C}$$ are large (require more bits to express). We refer to a concept class as **Agnostically Learnable** if we can efficiently solve this problem for any distribution $$\mathcal{D}$$. 

It's important to note that this is a very natural model of learning. In practice, we rarely have the luxury of making any assumptions about the true distribution over which our data is drawn. For example, a computer vision researcher who builds a model to classify images or a natural language processing researcher who constructs a system to detect hate speech are performing Agnostic Learning. The distributions of natural images and text are extraordinarily complicated, and most assumptions about them being equivalent to a well-understood closed-form probability distribution are likely to be incorrect.  

However, pure Agnostic Learning is intractable for even simple concept classes, such as the conjunction class and linear halfspace class described above. For this reason, most mathematical insights in Computational Learning Theory rely on assumptions over $$\mathcal{D}$$. One of the least restrictive assumptions is that the marginal distribution $$\mathcal{D}_X$$ of $$\mathcal{D}$$ over $$\mathbf{X}$$ is a member of some well understood class of distributions. This is the **Distribution-specific Agnostic Learning** framework. Just this assumption alone significantly simplifies the problem. For example, if we assume that $$\mathcal{D}_X$$ is the spherical normal distribution $$\mathcal{N}(0, \frac{1}{n}I)$$, then we can efficiently learn the concept class of linear halfspaces.

It's worth noting that in both Agnostic Learning and Distribution-specific Agnostic Learning, search algorithms that have access to just the example oracle $$EX(\mathcal{D})$$ are equally powerful as search algorithms that have access to both $$EX(\mathcal{D})$$ and the membership oracle $$MQ(\mathcal{D})$$. In order for the membership oracle to increase the power of the search algorithm, we need to make further assumptions about the relationship that $$\mathcal{D}$$ defines between $$\mathbf{X}$$ and $$\mathbf{y}$$.


### PAC Learning
For example, one significant simplification we can make is to assume that for some concept class $$\mathcal{C}$$, there exists some truth concept $$c$$ such that $$Pr_{(X,y) \sim \mathcal{D}}(c(X) != y) = 0$$. This is the **PAC**, or "Probably Approximately Correct" framework. We refer to a concept class as being **PAC-learnable** if for any truth concept $$c$$ in that class and any associated distribution $$\mathcal{D}$$, with probability $$1-\delta$$ we can use an example oracle $$EX(\mathcal{D})$$ to efficiently find a concept $$c'$$ such that $$Pr_{(X,y) \sim \mathcal{D}}(c'(X) != y) < \epsilon$$. There are a number of variations of PAC learning, which we will go through below.


#### Proper vs Improper PAC Learning
In the **proper PAC learning** framework, we require that $$c'$$ is from the same concept class as $$\mathcal{C}$$. Both the concept class of linear halfspaces and the concept class of conjunctions are properly PAC-learnable. In contrast, in the **improper PAC learning** framework, we allow $$c'$$ to be from a different concept class than the target concept $$c$$. Intuitively, we would expect that there are concept classes that are improperly PAC learnable, but are not PAC-learnable. This turns out to be the case. One reason for this is that some non-properly PAC learnable concept classes are subsets of properly PAC learnable concept classes. For example, although the concept class of boolean formulas that we can express as a disjunction of 3 conjunctions (3-Term DNF) is not properly PAC learnable, the larger concept class of boolean formulas that we can express as conjunctions of 3-term disjunctions (3-CNF) is properly PAC learnable. Since the concept class of 3-CNF formulas contains the concept class of 3-Term DNF formulas, we can use the algorithm for properly learning 3-CNF when given an example oracle $$EX(\mathcal{D})$$ for a distribution $$\mathcal{D}$$ that is defined by a 3-Term DNF formula $$c$$. This implies that 3-Term DNF is improperly PAC learnable.


#### Weak vs String PAC Learning
Another variation of PAC learning is **weak PAC learning**, where we relax the requirement that the generated concept has error less than any arbitrary $$\epsilon$$ and instead allow it to have error less than some fixed $$\epsilon < 0.5$$. We refer to non-weak PAC learning as **strong PAC learning**. Although we may expect that there are concept classes that are weakly PAC learnable, but are not strongly PAC-learnable, this is actually false. The reason for this is that there exist algorithms, such as [Boosting](https://www.cs.princeton.edu/picasso/mats/schapire02boosting_schapire.pdf), that can transform a weak PAC learning algorithm into a strong PAC learning algorithm. These algorithms work by repeatedly running the algorithm on slightly different versions of the target distribution and intelligently averaging the outputs. Since these algorithms can run efficiently, any concept class that is weakly PAC-learnable is also PAC-learnable.


#### PAC Learning with Membership Queries
Yet another variation of PAC learning is **PAC learning with membership queries**, where in addition to the example oracle $$EX(\mathcal{D})$$ we allow the learning algorithm access to the membership oracle $$MQ(\mathcal{D})$$ that accepts $$X \in \mathbf{X}$$ and produces its label according to the target concept $$c(X)$$. Learning algorithms that have access to $$MQ(\mathcal{D})$$ are (most likely) capable of learning concept classes that algorithms without this access cannot learn. The reason for this is that algorithms with access to a membership oracle can directly probe their "areas of uncertainty" in the space $$\textbf{X}$$ rather than being at the mercy of the samples drawn from $$\mathcal{D}_X$$. One example of a concept class that is PAC learnable with membership queries but is not known to be PAC learnable without membership queries is the concept class of monotone-DNF formulas, or boolean formulas that can be expressed as disjunctions of conjunctions of positive literals.

For mathematical convenience, researchers sometimes use the **EQ-MQ** framework as an alternative to PAC learning with membership queries. In this framework, we allow the algorithm access to the membership oracle $$MQ(\mathcal{D})$$ as well as an **equivalence oracle** $$EQ(c')$$ that accepts a candidate concept $$c'$$ and either returns "Yes" if the candidate concept is exactly equivalent to the target concept or a counterexample if it is not. Instead of expecting the algorithm to find a concept $$c'$$ such that $$Pr_{(X,y) \sim \mathcal{D}}(c'(X) != y) < \epsilon$$ with probability $$1-\delta$$, we instead require the algorithm to find the exact target concept $$c$$. It's not too hard to see that any concept class that is EQ-MQ learnable is also PAC learnable with membership queries (we can replace the calls to $$EQ(c')$$ with a sufficiently large number of calls to $$EX(\mathcal{D})$$). It's also easy to see that the converse is not true. For example, a concept class of uncountable size could never be exactly learnable.

<!-- Another theoretical 
 Mistake Bound PAC Learning???????
Mistake Bound Learning
  - Online learning framework
  - Samples are generated by some underlying process (could be adversarial), aim to bound the total number of mistakes
  - Bound the total number of mistakes before the algorithm scores perfect from then on
  - Very similar to EQ-MQ, and learning with N equivalence queries is the same as learning with up to N mistake
 -->


#### Noise
One of the fundamental differences between all of the variants of PAC learning that we have described and the more realistic scenario of Agnostic learning is the very strong assumption on $$\mathcal{D}$$ that there exists some truth concept $$c$$ such that $$Pr_{(X,y) \sim \mathcal{D}}(c(X) != y) = 0$$. It's worth considering how we can relax this assumption without reverting to the intractability of Agnostic Learning. One simple way to do this is to define a noisy distribution $$\mathcal{D}^{\nu}$$ such that $$Pr_{(X,y) \sim \mathcal{D}^{\nu}}(c(X) != y) < \nu$$. Of course, the structure of this distribution is critical. In the **PAC Learning with Random Classification Noise** model of learning we allow the learning algorithm access to the noisy example oracle $$EX(\mathcal{D}^{\nu})$$ that generates samples from $$\mathcal{D}^{\nu}$$. Importantly, we still measure the algorithm's error with respect to the noiseless distribution. That is, we still require the learning algorithm to find a $$c' \in \mathcal{C}$$ such that $$Pr_{(X,y) \sim \mathcal{D}}(c'(X) != y) < \epsilon$$ with probability $$1-\delta$$.

One key thing to note about this framework is that we generally assume that $$Pr(c(X) != y)$$ is not dependent on $$X$$ (i.e. the noise is independent for each example). This significantly simplifies the problem, but it severely limits the practical applications of the framework. For example, there are many cases where a simple concept class may approximate some natural phenomena reasonably well, but where the errors are highly dependent on $$X$$. For example, although a multidimensional linear halfspace may reasonably approximate a bank's loan approval behavior, there are nonlinear effects, such as changes in how credit history is treated for higher net worth clients, that are decidedly not independent of $$X$$. 

However, even when we assume that the noise is independent, there are concept classes that are PAC-learnable but not PAC-learnable with random classification noise. For example, although the concept class of parity functions defined by subsets of boolean literals is PAC learnable, it is widely believed to not be PAC-learnable with random classification noise. This makes intuitive sense: since the output of a parity function depends on all of the elements in the subset of boolean literals that defines it, an algorithm for learning parity functions in the face of noise will need to operate on a subset basis rather than a per-literal basis. Since there are exponentially many subsets, this makes efficient learning challenging.

Like PAC learning with membership queries, there exists an alternative framework that we can use to reason about PAC-learning with random classification noise. In the **SQ** framework, we allow the learning algorithm access to only a **statistical query oracle** $$STAT(\mathcal{D})$$ oracle that can provide estimates of the expected values of random variables defined over $$\mathcal{D}$$. It's not hard to see that any concept class that is SQ-learnable is also PAC-learnable with random classification noise. Given access to a noisy example oracle $$EX(\mathcal{D}^{\nu})$$, we can simulate a query to $$STAT(\mathcal{D})$$ by drawing many examples from $$EX(\mathcal{D}^{\nu})$$ and computing an empirical estimate of the target expected value.


## Regression

Another broad subcategory of supervised learning is **regression**. In a regression problem, we assume that $$y$$ is an element of $$\mathbb{R}$$. We generally also assume that $$X$$ is an element of $$\mathbb{R}^n$$ and that there exists some joint probability distribution $$\mathcal{D}$$ over $$\mathbb{R}^n \times \mathbb{R}$$ from which samples are drawn.

Like with classification, there are many ways to formulate regression problems based on applying different assumptions to $$\mathcal{D}$$. One of the simplest strategies is to formulate it as the following optimization problem: For some set of functions $$\mathcal{F}$$ and some "loss function" $$L$$, find the function $$f \in \mathcal{F}$$ that minimizes the function $$E_{(X,y) \sim \mathcal{D}}[L(f(X), y)]$$. Let's note that if we set our loss function $$L(a,b) = (a-b)^2$$ and make the assumption that there exists some target function $$f$$ such that $$f(X) = E_{(X,y) \sim \mathcal{D}}[y \vert X]$$, then this is equivalent to minimizing $$E_{(X,y) \sim \mathcal{D}}[(f(X) - f'(X_i))^2]$$.

Of course, in order to minimize $$E_{(X,y) \sim \mathcal{D}}[L(f(X), y)]$$ with classical optimization techniques, we will first need to approximate it. Given an example oracle $$EX(\mathcal{D})$$ from which we can draw $$n$$ samples $$(X_i, y_i) \sim \mathcal{D}$$, we can approximate this expectation with the expression $$\frac{1}{n}\sum_{i=1}^{n} L(f(X_i), y_i)$$. The quality of this estimate will depend on the size of $$n$$, the complexity of $$\mathcal{D}$$ and the [expressiveness](https://en.wikipedia.org/wiki/Rademacher_complexity) of the set from which we are selecting $$f$$. Depending on the set $$\mathcal{F}$$ and the size of $$n$$, there are a wide range of techniques that we can use to find the $$f$$ that minimizes (or nearly minimizes) this estimate, including closed form optimization, gradient descent, and the method of Lagrange multipliers.


## Resources

Most of the content in this post is from [An Introduction to Computational Learning Theory](https://www.amazon.com/Introduction-Computational-Learning-Theory-Press/dp/0262111934) by Michael J. Kearns. Some content is also drawn from [Toward Efficient Agnostic Learning](http://rob.schapire.net/papers/agnostic.pdf), [A theory of the learnable](https://dl.acm.org/doi/10.1145/1968.1972), and [Convex Optimization: Algorithms and Complexity](https://arxiv.org/abs/1405.4980),









<!-- 


==============================

 aim to find a function $$f$$ that minimizes .


There is of course great nuance to this, and the more complex that we assume $$\mathcal{D}$$ is or allow $$f$$ to be, the more samples we would need to 





Given an algorithm $$c$$ that can accept some $$X \in \mathbf{X}$$ and return some $$y \in \{0,1\}$$, we can quantify its **error** relative to the distribution $$\mathcal{D}$$ as $$Pr(c(X) != y \vert (X,y) \sim \mathcal{D})$$. We will refer to such an algorithm as a **concept**.


Learning Real Valued Function
  - Noise is essentially required
    - We expect y to be drawn from a distribution centered at g(x)
  - Aim to minimize expectation of loss function, which we approximate with empirical loss

- concept class and concepts
- agnostic learning, find the best concept for the distribution
- Access Models, via membership queries or datasets
  - note that these are the same if we make no assumptions on the relationship between X and y
  - 
- Define agnostic learning
  - We typically allow the algorithm to run longer or collect more samples based on $$\delta, \epsilon$$ and other characterizations of the hardness of the learning problem

- PAC learning, using dataset + assumption that the distribution is associated with a concept
  - proper/improper PAC learning, the underlying concept is/is not the same as the hypothesis class
  - acceptance criteria and goals:
    Strong vs Weak PAC learning, equivalence via boosting
- Membership queries - note that this adds power to PAC learning
- MQ-EQ
- PAC learning with noise, slight change to the distribution
- statistical query learning, equivalent to PAC learning with noise




Agnostic Learning
  - Most realistic model
  - No assumptions on the underlying distribution, just a goal of finding the best approximator among elements of the concept class
  - Generally highly intractable

PAC learning
  - Proper PAC learning - model must output hypothesis from hypothesis class being learned
  - Improper PAC learning - model may output any polynomially evaluatable hypothesis

Weak PAC learning
  - Can only learn up to a maximum value of the error parameter 


Learning from statistical queries
  - learn based on a statistical query oracle that returns bounded estimates of the probability that a given quantity is satisfied by positive or negative examples
  - equivalent to PAC learning with classification noise η
    - easy to simulate the statistical oracle up to confidence parameter d
  - Not equivalent to PAC learning. There are PAC-learnable classes that are not Stat learnable

Exact learning from membership and equivalence queries
  - equivalent to "efficiently PAC learnable with membership queries"


Mistake Bound Learning
  - Online learning framework
  - Samples are generated by some underlying process (could be adversarial), aim to bound the total number of mistakes
  - Bound the total number of mistakes before the algorithm scores perfect from then on
  - Very similar to EQ-MQ, and learning with N equivalence queries is the same as learning with up to N mistakes


===============











any algorithm that learns a parity function will be extremely noise-sensitive, since it cannot build the function iter

A different way to look at learning with noise is the statistical query framework...



Like PAC learning with membership queries, there exists a framework for





, then the learning problem is far harder. 




, since we can use the algorithm that outputs a 3-CNF formula when given samples from a distribution $$\mathcal{D}$$ 




 exists an algorithm such that, the algorithm can use the example oracle $$EX(\mathcal{D})$$ to 

Both examples of concept classes that e


There are many variations of PAC learning, for example

* Improper vs Proper PAC learning
* Strong vs Weak PAC learning

It's worth noting that 




 this setting, we aim to  we PAC, or probably approximately correct learnin g



 support of $$D$$ is contained in the

characterize the 

Given such a distribution, the easiest way to measure 

One of the simplest ways to 

DEFINE ACCURAC



One of the simplest formulations is to just assume 










A slightly easier model is , in which we make the assumption that the 


 For most concept classes $$\mathcal{C}$$ 
- goal is to measure the concept class
- things get easier if we allow assumptions on marginal distribution of X
- no difference between allowing membership queries or not 

For any distribution $$\mathcal{D}$$, we 


 other characterizations of the hardness of the learning problem



"failure rate" parameter $$\delta$$ because it is always possible that the search process, which generally relies on sampling from $$\mathcal{D}$$ in one way or another



Instead, given some pair $$\epsilon, \delta$$ we will characterize the problem as one of finding with probability $$1-\delta$$ a concept $$c \in \mathcal{C}$$ that has error less than $$\text{opt} + \epsilon$$, where $$\text{opt}$$ is the the minimum error relative to the distribution $$\mathcal{D}$$ of any concept $$c \in \mathcal{C}$$. We will refer to this


In the *Agnostic Learning* model of learning, we


distribution specific, distribution generic...

 -->