---
layout: post
title: Characterizing the invariances of iterative optimizers using category theory
tags: [Gradient Descent, Differential Equations, Euler's Method]
---
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

<!-- http://pages.cs.wisc.edu/~swright/nd2016/chapter3_part.pdf?fbclid=IwAR33EOF604vX7DiJ2btp3djW11iWLxq3jnVbb6SGgGYvPblaqwAALdBpSa4-->

<!-- TODO: Can we define a category of functors (what is a natural transformation between optimization algorithms?) Do we need to weaken invertibility to enable this?  -->

<!-- TODO: Is there some kind of normalized gradient descent procedure that we can use that exhibits linear invariance? Do we need a weaker invariance criterion? Maybe Covariant Derivative is what we want http://awibisono.github.io/2016/09/12/covariant-derivative.html?  -->


<!-- TODO: Are there any uniqueness or absolute spectrum properties that we can prove (similarly to the uniqueness/spectrum properties in clustering?)-->


<!-- TODO: Can we characterize our optimizers as DJM's dynamical systems (lenses) or otherwise capture the composition of loss functions with each other?



TODO: Do we want to apply the transformation identically to the parameters and the placeholders or would it be better to apply a single unified transform? We may want to look into perturbation stuff?



TODO: Can we show that normalized gradient or Rprop are invariant: https://www.cs.virginia.edu/yanjun/teach/2015f/lecture/L4-GD.pdf -->



<!-- yyTODO: What does it mean for the subcategory of Base to have products? coproducts? limits? pullbacks? etc??? -->




#### Continuous Optimization Algorithms
Suppose we have a function $$l: \mathbb{R}^n \rightarrow \mathbb{R}$$ that we want to minimize. A popular algorithm for accomplishing this is gradient descent, which is an iterative algorithm in which we pick a step size $$\alpha$$ and a starting point $$x_0 \in \mathbb{R}^n$$ and repeatedly iterate $$x_{t+\alpha} = x_{t} - \alpha * \nabla l(x_t)$$. If we take the $$lim_{\alpha \rightarrow 0}$$ of this iteration step, we get the differential equation $$\frac{dx}{dt} = -\nabla l(x)$$, which we will refer to as the **continuous limit** of gradient descent. In my [last post](http://danshiebler.com/2020-11-28-gradient-descent/), I demonstrated that we can derive gradient descent as the Euler's method discretization of this differential equation.

Many other iterative optimization algorithms have continuous limits. For example, the continuous limit of Newton's method, in which we iterate $$x_{t+\alpha} = x_{t} - \alpha (\nabla^2 l (x_t))^{-1}\nabla l(x_t)$$, is $$\frac{dx}{dt} = -(\nabla^2 l (x))^{-1}\nabla l(x)$$.


Some iterative optimization algorithms use placeholder variables to store historical update values or parameter values. For example, in the momentum algorithm we introduce a placeholder variable $$y$$ and iterate:

$$x_{t + \alpha} = x_t + \alpha y_{t} \qquad
y_{t + \alpha} = y_t - \alpha y_t - \alpha \nabla l(x_t)))$$

The continuous limit of momentum is:

$$dx/dt = y \qquad
dy/dt = - y - \nabla l(x)$$

Similarly, in the Adagrad algorithm we introduce a placeholder variable $$y$$ and iterate:

$$x_{t + \alpha} = x_t + \frac{\alpha \nabla l(x_t)}{\sqrt{y_t}} \qquad
y_{t + \alpha} = y_t + \alpha \nabla l(x_t)^2$$

where the division in the first equality is performed elementwise. The continuous limit of Adagrad is:

$$dx/dt = -\nabla l(x_t) / \sqrt{y_t} \qquad
dy/dt = \nabla l(x_t)^2$$




More generally, if we assume that the dimensionality of the placeholder vector is a multiple of the parameter vector dimensionality we can represent the continuous limit of an iterative optimization algorithm for the objective function $$l: \mathbb{R}^{n} \rightarrow \mathbb{R}$$ with a map $$d: \mathbb{R}^{n} \times \mathbb{R}^{kn} \rightarrow \mathbb{R}^{kn} \times \mathbb{R}^{kn}$$, which we will refer to as a **continuous optimizer**. Intuitively, the function $$d(x,y) = (dx / dt, dy / dt)$$ describes the instantaneous state of the optimization process at a given parameter vector $$x$$ and optional placeholder vector $$y$$. For example, the Newton's method continuous optimizer is $$d(x) = (\nabla^2 l (x))^{-1}\nabla l(x)$$ and the momentum continuous optimizer is $$d((x,y)) = (y, - y - \nabla l(x))$$.

A **continuous optimization algorithm** is then a dependently typed function
$$u: [n] \rightarrow (\mathbb{R}^{n} \rightarrow \mathbb{R}) \rightarrow (\mathbb{R}^{n} \times \mathbb{R}^{kn} \rightarrow \mathbb{R}^n \times \mathbb{R}^{kn})$$
that maps smooth objective functions $$l: \mathbb{R}^{n} \rightarrow \mathbb{R}$$ to continuous optimizers
$$d_l: \mathbb{R}^{n} \times \mathbb{R}^{kn} \rightarrow \mathbb{R}^{n} \times \mathbb{R}^{kn}$$.
For example, the gradient descent continuous optimization algorithm maps $$l: \mathbb{R}^{n} \rightarrow \mathbb{R}$$ to $$-\nabla l: \mathbb{R}^{n} \rightarrow \mathbb{R}^{n}$$. Note that given a continuous optimization algorithm $$u$$ and an objective $$l$$, we can recover the corresponding discrete optimization algorithm with Euler's method as $$x_{t + \alpha} = x_0 + \alpha u(l)(x_t)$$












#### Invariant Continuous Optimization Algorithms
<!-- **QUESTION: We would like to say that invariance cannot improve the "time to steady state" quantity. What is this quantity? Is there a simple way we can describe this? ** -->
<!-- Gradient Descent is invariant to orthogonal transformations: http://building-babylon.net/2016/10/05/orthogonal-transformations-and-gradient-updates/ -->


In some situations, we may be able to improve the efficiency of an optimization algorithm by transforming our data first with an invertible function $$f: \mathbb{R}^m \rightarrow \mathbb{R}^n$$. That is, rather than optimize the function $$l: \mathbb{R}^{n} \rightarrow \mathbb{R}$$, we may be able to reduce the time to convergence by optimizing $$l \circ f: \mathbb{R}^{m} \rightarrow \mathbb{R}$$. However, for many optimization algorithms there are classes of transformations to which they are invariant: applying any such transformation to the data before running the optimization algorithm cannot change the results. Formally, consider the invertible transformation $$f: \mathbb{R}^{m} \rightarrow \mathbb{R}^n$$ and write $$f_{k+1}$$ for the map $$(f \otimes f \otimes f ...): \mathbb{R}^m \times \mathbb{R}^{km} \rightarrow \mathbb{R}^n \times \mathbb{R}^{kn}$$. We will say that a continuous optimization algorithm $$u$$ is invariant to $$f$$ if $$u(l \circ f_{k+1}) = f_{k+1}^{-1} \circ u(l) \circ f_{k+1}$$. We provide some concrete examples below:


##### Newton's Method
Newton's method is invariant to all linear transformations:
$$\begin{aligned}
 d_{l \circ f}(x) = \\
 -(\nabla^{2} (l \circ f)(x))^{-1} \nabla (l \circ f)(x) =\\
-A^{-1}(\nabla^{2}l(Ax))^{-1} A^{-T}A^{T}\nabla l(Ax) = \\
-A^{-1}(\nabla^{2}l(Ax))^{-1}\nabla l(Ax) = \\
-f^{-1}((\nabla^{2}l(f(x)))^{-1} \nabla l(f(x))) =
f^{-1}d_l(f(x))
\end{aligned}$$


##### Gradient Descent
Gradient descent is invariant to orthogonal linear transformations, but not to linear transformations in general. Consider any function of the form $$f(x) = Ax$$ where $$A$$ is an orthogonal matrix. Then since $$A^{T} = A^{-1}$$ we have that:

$$\begin{aligned}
d_{l \circ f}(x) =
-\nabla (l \circ f)(x) =
-A^{T} (\nabla l (Ax)) =
-A^{-1} (\nabla l (Ax)) =
f^{-1}d_l(f(x))
\end{aligned}$$

##### Momentum
Momentum is also invariant to orthogonal linear transformations, but not to linear transformations in general:

$$\begin{aligned}
d_{l \circ f}(x, y)_x = y = A^{T}Ay = f^{-1}(d_{l}(f(x), f(y)))_x
\\
d_{l \circ f}(x, y)_y =
y - \nabla (l \circ f)(x)) =
- A^{-1}Ay - A^{-1} \nabla l(Ax)) =
f^{-1}(d_{l}(f(x), f(y)))_y
\end{aligned}$$




##### Adagrad
Adagrad is not invariant to linear transformations due to the fact that it tracks a nonlinear function of past gradients (sum of squares). However, Adagrad is invariant to permutation maps. If $$f(x) = Px$$ is a permutation map then we have:

$$\begin{aligned}
d_{l \circ f}(x, y)_x =
-\nabla (l\circ f)(x) / \sqrt{y} =
-P^{-1}\left(\nabla l(Px) / \sqrt{Py}\right) =
f^{-1}(d_{l}(f(x), f(y)))_x
\\
d_{l \circ f}(x, y)_y =
(\nabla (l\circ f)(x))^2 =
(P^{T}\nabla l(Px))^2 =
P^{-1}(\nabla l(Px))^2 =
f^{-1}(d_{l}(f(x), f(y)))_y
\end{aligned}$$





#### Invariance and Euler's Method


<!-- **TODO: Can we make this work for a placeholder vector** -->
In the case that there is no placeholder vector, $$f(x) = Ax$$ is linear and $$u$$ is invariant to $$f$$, then the trajectory of the Euler's method discretization of $$u$$ cannot be made to converge faster or better by first applying $$f$$ to the data. That is, consider starting at some point $$x_0 \in \mathbb{R}^n$$ and repeatedly taking Euler steps $$x_{n+1} = x_n + \alpha u(l)(x_n)$$. Now suppose instead that we start at the point $$y_0 = A^{-1}x_0$$ and take Euler steps $$y_{n+1} = y_n + \alpha u(l \circ f)(y_n)$$. By induction we can see that:

$$y_{n+1} =
y_n + \alpha u(l \circ f)(y_n) =
y_n + \alpha A^{-1}(u(l)(Ay_n)) =
A^{-1}(x_n) + \alpha A^{-1}(u(l)(x_n)) =
A^{-1}(x_{n+1})$$




#### Transformation Invariance is Functoriality

If we characterize continuous optimization algorithms as maps between two categories, we can demonstrate that their invariance properties are equivalent to their functoriality.

In the category $$Fun$$, objects are smooth objective functions $$l: \mathbb{R}^{n} \rightarrow \mathbb{R}$$ and the morphisms between $$l: \mathbb{R}^{n} \rightarrow \mathbb{R}$$
and $$l': \mathbb{R}^{m} \rightarrow \mathbb{R}$$ are functions $$f: \mathbb{R}^{m} \rightarrow \mathbb{R}^{n}$$ such that $$l' = l \circ f$$. In the category $$Opt$$, objects are continuous optimizers and the morphisms from $$d: \mathbb{R}^{n} \times \mathbb{R}^{kn} \rightarrow \mathbb{R}^{n} \times \mathbb{R}^{kn}$$ to $$d': \mathbb{R}^{m} \times \mathbb{R}^{km} \rightarrow \mathbb{R}^{m} \times \mathbb{R}^{km}$$ are functions $$f: \mathbb{R}^{m} \rightarrow \mathbb{R}^{n}$$ such that $$d' = f_{k+1}^{-1} \circ d \circ f_{k+1}$$.

Given a subcategory of $$Fun$$, a continuous optimization algorithm $$u$$ defines a functor from that subcategory to $$Opt$$ if $$u$$ is invariant to any morphism $$f$$ in that subcategory. We will call such a functor a **continuous optimization functor**. That is, we can characterize the invariance of an optimization algorithm in terms of the subcategories of $$Fun$$ over which it is functorial. For example:

- $$Fun_I$$ is the subcategory of $$Fun$$ in which morphisms are limited to identities. Any continuous optimization algorithm is a functor from $$Fun_I$$.
- $$Fun_P$$ is the subcategory of $$Fun$$ in which morphisms are limited to permutations. The Adagrad continuous optimization algorithm is a functor from $$Fun_P$$.
- $$Fun_O$$ is the subcategory of $$Fun$$ in which morphisms are limited to orthogonal linear maps. Both the gradient descent and momentum continuous optimization algorithms are functors from $$Fun_O$$.
- $$Fun_L$$ is the subcategory of $$Fun$$ in which morphisms are limited to invertible linear maps. The Newton's method continuous optimization algorithm is a functor from $$Fun_L$$.





#### References

* [Characterizing the invariances of learning algorithms using category theory](https://arxiv.org/pdf/1905.02072.pdf)
* [Notes on Newton's Method](http://users.ece.utexas.edu/~cmcaram/EE381V_2012F/Lecture_6_Scribe_Notes.final.pdf)
* [Gradient Methods Using Momentum and Memory](http://pages.cs.wisc.edu/~swright/nd2016/chapter3_part.pdf?fbclid=IwAR33EOF604vX7DiJ2btp3djW11iWLxq3jnVbb6SGgGYvPblaqwAALdBpSa4)



















































































































































<!-- In the category $$Base$$, objects are natural numbers and the morphisms from $$n$$ to $$m$$ are invertible functions $$f: \mathbb{R}^{n} \rightarrow \mathbb{R}^{m}$$. We will work primarily with two functors that map from $$Base$$ and its subcategories into $$Set$$. -->
<!-- The first functor, $$Forward$$, maps objects in $$Base$$ to sets of objective functions. Formally, $$Forward$$ is a contravariant functor that maps the object $$n$$ to the set of all \

to the function $$f': (\mathbb{R}^{n} \rightarrow \mathbb{R}) \rightarrow (\mathbb{R}^{m} \rightarrow \mathbb{R})$$ where $$f'(l) = l \circ f$$.


-->

<!-- The second functor, $$Backward$$, maps objects in $$Base$$ to sets of continuous optimizers. Formally $$Backward$$ is a contravariant functor that maps the object $$n$$ to the set of all functions
$$d: \mathbb{R}^{n} \times \mathbb{R}^{kn} \rightarrow \mathbb{R}^{n} \times \mathbb{R}^{kn}$$. On morphisms, $$Backward$$ maps the function $$f: \mathbb{R}^{m} \rightarrow \mathbb{R}^{n}$$ to the function
$$f': (\mathbb{R}^{n} \times \mathbb{R}^{kn} \rightarrow \mathbb{R}^{n} \times \mathbb{R}^{kn}) \rightarrow (\mathbb{R}^{m} \times \mathbb{R}^{km} \rightarrow \mathbb{R}^{m} \times \mathbb{R}^{km})$$ that maps $$d$$ to $$f_{k+1}^{-1} \circ d \circ f_{k+1}$$. -->

<!-- in which the differential equation is a continuous representation of an optimization algorithm for that objective function. -->

<!-- The second functor, $$Backward$$, maps objects in $$Base$$ to sets of (objective function, differential equation) pairs in which the differential equation is a continuous representation of an optimization algorithm for that objective function. -->
<!--
In order for gradient descent to be natural over a subcategory of $$Base$$, it must be that for any morphism $$f$$ in that subcategory:

$$-\nabla (l \circ f)(x) = -f^{-1}(\nabla l(f(x))$$

An example is the subcategory $$Base_P$$ of $$Base$$ in which morphisms are limited to permutations. To see this, note that we can represent $$f$$ with a permutation matrix $$P_f$$ and that:

$$-\nabla (l \circ f)(x) = -P^{T} (\nabla l (Px)) = -f^{-1} (\nabla l (f(x)))$$

where the final set holds because the transpose of a permutation matrix is its inverse. Now consider instead the subcategory $$Base_L$$ of $$Base$$ in which morphisms are limited to linear maps. Since the transpose of a linear map is not its inverse, gradient descent is not natural over this category. However, we can see that Newton's method is natural since:

$$-(\nabla^{2} (l \circ f)(x))^{-1} \nabla (l \circ f)(x) =\\
-A^{-1}(\nabla^{2}l(Ax))^{-1} A^{-T}A^{T}\nabla l(Ax) = \\
-A^{-1}(\nabla^{2}l(Ax))^{-1}\nabla l(Ax) = \\
-f^{-1}((\nabla^{2}l(f(x)))^{-1} \nabla l(f(x)))$$ -->


<!-- The second functor, $$Backward$$, maps objects in $$Base$$ to sets of (objective function, continuous optimization algorithm) pairs. Formally $$Backward$$ is a contravariant functor that maps the object $$n$$ to the set of all pairs $$(l, u)$$ where $$l: \mathbb{R}^{n} \rightarrow R$$ is a smooth function and
$$u: (\mathbb{R}^{n} \rightarrow \mathbb{R}) \rightarrow (\mathbb{R}^{n} \times \mathbb{R}^{kn} \rightarrow \mathbb{R}^{n} \times \mathbb{R}^{kn})$$
is a continuous optimization algorithm that maps objective functions to continuous optimizers. On morphisms, $$Backward$$ maps the function $$f: \mathbb{R}^{n} \rightarrow \mathbb{R}^{m}$$ to the function $$f'$$ that maps $$(l, u)$$ to $$(l', u')$$ where $$l' =  l \circ f$$ and $$u'(l) = f \circ u(l) \circ f^{-1}$$ -->
<!-- Formally, we will say that a continuous optimization algorithm
$$u: (\mathbb{R}^{n} \rightarrow \mathbb{R}) \rightarrow (\mathbb{R}^{n} \times \mathbb{R}^{kn} \rightarrow \mathbb{R}^n \times \mathbb{R}^{kn})$$
is invariant to the invertible transformation $$f: \mathbb{R}^{m} \rightarrow \mathbb{R}^n$$ if there exists some transformation $$g: \mathbb{R}^{d'} \rightarrow \mathbb{R}^d$$ such that $$u(l \circ \langle f, g\rangle) = \langle f^{-1}, g^{-1}\rangle \circ u(l) \circ \langle f, g\rangle$$. -->

<!--
d_{l \circ f}(x, y) = =
 = \\
- A^{T}Ay - A^{T} \nabla l(Ax)) = \\
f^{-1}(- f(y) -\nabla l(f(x)))) =
f^{-1}(- g(y) -\nabla l(f(x)))) = f^{-1}(d_l(x, y)_y)$$\begin{aligned}
d_{l \circ f}(x, y) = \\
(y, - y - \nabla (l \circ f)(x))=
(y, - y - \nabla (l \circ f)(x)) =\\
(y, - y - A^{T} \nabla l(Ax)) = \\
(A^{T}Ay, - A^{T}Ay - A^{T} \nabla l(Ax)) = \\
(f^{-1}(f(y)), f^{-1}(- f(y) -\nabla l(f(x)))) = \\
(g^{-1}(g(y)), f^{-1}(- g(y) -\nabla l(f(x)))) = \\
(g^{-1}(d_l(x, y))_x, f^{-1}(d_l(x, y)_y)
,which

$$d((x,y)) = (y, - y - \nabla (l \circ f)(x))$$.
 -->
<!-- Intuitively, an optimization algorithm is invariant to a class of transformations if its continuous trajectory is not affected by dataset transformations that take the form of a transformation in that class. -->

<!-- for example, the continuous limit of Newton's method is $$\frac{dx}{dt} = -(\nabla^2 l (x))^{-1}\nabla l(x)$$ and the continuous limit of momentum is  -->
<!-- Note that we can equivalently write this as $$d^2 x / dt^{2} + dx/dt = - \nabla l(x)$$. -->
<!--
For example, applying Euler's method to the Newton's method continuous optimizer $$d(x) = (\nabla^2 l (x))^{-1}\nabla l(x)$$ yields $$x_{t + \alpha} = x_t + \alpha (\nabla^2 l (x_t))^{-1}\nabla l(x_t)$$, which is exactly the discrete form of Newton's method. Similarly, applying Euler's method to the momentum continuous optimizer $$d((x,y)) = (y, - y - \nabla l(x))$$ yields:

$$x_{t + \alpha} = x_t + \alpha y_{t} \\
y_{t + \alpha} = y_t - \alpha y_t - \alpha \nabla l(x_t))$$

which is exactly the discrete form of momentum.  -->

<!-- As another example, consider the momentum algorithm:

The continuous optimizer for Newton's method is $$d(x) = (\nabla^2 l (x))^{-1}\nabla l(x)$$ and the continuous optimizer for momentum is $$d((x,y)) = (y, -y - \nabla l(x))$$.
$$x_{t+1} = x_{t} - y_{t} - \nabla l(x) \\
y_{t+1} = x_{t}$$
We can recover this algorithm as the Euler's method discretization of the differential equation $$d^2 x / dt^{2} + dx/dt = - \nabla l(x)$$. The associated continuous optimizer is $$d_l: \mathbb{R}^{2n} \rightarrow \mathbb{R}^{2n}$$ where:

$$d_l((x,y)) = (y, -y - \nabla l(x))$$
-->



<!-- We can express this as the differential equation $$d^2 x / dt^{2} + dx/dt = - \nabla l(x)$$, and the Euler's method discretizatio  -->


<!-- In general, we can represent a continuous optimization algorithm with a **continuous optimizer**, or a tuple $$(l:\mathbb{R}^{n} \rightarrow \mathbb{R}, u: \mathbb{R}^{n} \rightarrow \mathbb{R}^{n})$$. Intuitively, the function $$u(x) = dx / dt$$ describes the instantaneous state of the optimization process. Formally, given a objective function $$l$$, we can form the gradient descent optimization pair $$(l, -\nabla l (x))$$ and the Newton's method optimization pair $$(l, -(\nabla^2 l (x))^{-1}\nabla l(x))$$ -->


 <!-- $$\frac{dx}{dt} = -\nabla l(x)$$. Since we can derive this differential equation by taking $$lim_{\alpha \rightarrow 0}$$ of the gradient descent update step, we will refer to this differential equation as the **continuous limit** of gradient descent.  -->

<!-- describe such a differential equation as a function $$u: \mathbb{R}^{n} \rightarrow \mathbb{R}^{n}$$, which we will call a *continuous updater*. Given a  -->

<!-- We will refer to the pair of a function $$l: \mathbb{R}^{n} \rightarrow \mathbb{R}$$ and the optimization form  $$l^{*}: \mathbb{R}^{n} \rightarrow \mathbb{R}^{n}$$ as an *optimization pair.* -->


<!-- $$f':
(\mathbb{R}^{n} \rightarrow \mathbb{R}, ((\mathbb{R}^{n} \rightarrow \mathbb{R}) \rightarrow (\mathbb{R}^{n} \rightarrow \mathbb{R}^n)))
\rightarrow
(\mathbb{R}^{m} \rightarrow \mathbb{R}, ((\mathbb{R}^{m} \rightarrow \mathbb{R}) \rightarrow (\mathbb{R}^{m} \rightarrow \mathbb{R}^m)))$$ -->
<!-- The continuous limit of momentum is just $$(dx/dt, dy/dt) = (y, - y - \nabla l(x))$$, and the continuous limit of Adagrad is $$(dx/dt, dy/dt) = (-\nabla f(x_t) / \sqrt{y_t}, \nabla f(x_t)^2)$$.  -->

 <!-- Note that this is equivalent to the differential equation $$d^2 x / dt^{2} + dx/dt = - \nabla l(x)$$.

The Adagrad algorithm also introduces a placeholder variable $$y$$ and iterates
$$(x_{t + \alpha}, y_{t + \alpha}) =
,
)$$.

$$


dx/dt =
$$ -->
<!-- However, since these proofs only hold when $$A^{-1} = A^T$$, it is clear that neither gradient descent nor momentum are invariant to linear transformations in general. In contrast, -->
<!-- -->
<!-- Given a continuous optimization algorithm, we can characterize its transformation invariance by adding morphisms to $$Base$$ and determining whether naturality is maintained.  -->
