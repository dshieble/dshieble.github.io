---
layout: post
title: Gradient Descent Is Euler's Method
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

## Introduction
Gradient descent is a technique for iteratively minimizing a convex function $$f: \mathbb{R}^n \rightarrow \mathbb{R}$$ by repeatedly taking steps along its gradient. We define the gradient of $$f$$ to be the unique function $$\nabla f$$ that satisfies:

$$lim_{p \rightarrow 0} \frac{f(x+p) - f(x) - \nabla f(x)^{T}p}{\|p\|} = 0$$

The gradient of $$f$$ is a vector which points in the direction of maximum increase of $$f$$. As a corollary, the negative gradient $$- \nabla f(x)$$ points in the direction of maximum decrease of $$f$$. Intuitively, the gradient descent procedure minimizes $$f$$ by repeatedly taking steps in this direction of maximum decrease. Formally we pick a starting point $$x_0$$ and a step size $$\alpha$$ and iterate the following procedure:

$$x_{t+1} = x_t - \alpha * \nabla f(x_t)$$

There is another perspective from which we can derive the gradient descent procedure. Say we have a differential equation of the form $$\frac{dx}{dt} = g(x)$$. We can use Euler's method to solve this equation iteratively by choosing a starting point $$x_0$$ and iteratively approximating $$x_{t+\alpha} = x_t + \alpha * \frac{dx}{dt} = x_t + \alpha * g(x)$$ until we reach a steady state $$x_s$$ such that $$g(x_s) \simeq 0$$. 

Now consider the differential equation $$\frac{dx}{dt} = -\nabla f(x)$$. The steady state of this differential equation (when $$\frac{dx}{dt}=0$$) is at $$x_s$$ such that $$\nabla f(x_s) = 0$$, which must be an extrema of $$f$$. Note that applying Euler's method to this equation yields:

$$x_{t+\alpha} = x_{t} - \alpha * \nabla f(x_t)$$

Which is exactly the update step for gradient descent!



## References

* [Gradient descent and fast artificial time integration](https://www.cs.ubc.ca/~ascher/papers/adhs.pdf)
* [Hessian Free Optimization](https://andrew.gibiansky.com/blog/machine-learning/hessian-free-optimization/)
* [Convex Optimization](https://cims.nyu.edu/~cfgranda/pages/OBDA_fall17/notes/convex_optimization.pdf)













<!-- Say we use $t$ as a time index  for gradient descent. Then gradient descent with step size $\alpha$ is:
\[(x_{t+\alpha} - x_{t} )/\alpha = -\nabla f(x)\]as $\alpha \rightarrow 0$ this becomes

$$\frac{dx}{dt} = -\nabla f(x)$$


The steady state of this differential equation (when dx/dt=0) is when $\nabla f(x) = 0$, which must be an extrema. -->
<!-- 
$$\mathbf{X}$$




## Taylor Series Perspective

We can approximate the function $$f$$ about the point $$x$$ with the Taylor series:

$$f(x') = f(x) + \nabla f(x)(x' - x) + \frac{1}{2}(x' - x)^{T} \nabla^{2}f(x) (x'-x) + ...$$

For a given number of terms, the quality of this approximation decreases as $$|x' - x|$$ increases. We can view gradient descent as forming thr 

 -->
