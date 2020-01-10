---
layout: post
title: White Noise is Pretty Weird
tags: [White Noise, Probability, Random Variables, Stochastic Process]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>


<!-- Useful book: http://ft-sipil.unila.ac.id/dbooks/AN%20INTRODUCTION%20TO%20STOCHASTIC%20DIFFERENTIAL%20EQUATIONS%20VERSION%201.2.pdf
 -->
I recently went off on a tangent trying to figure out how [white noise](https://en.wikipedia.org/wiki/White_noise) works, and I found that there is a lot of strangeness to it that may not be apparent at a first glance.

**TLDR**: We can't just define a continuous-time white noise process as an $$\mathbb{R}$$-indexed collection of uncorrelated standard normal random variables because such a collection does not exist.

## The Problem With White Noise

Let's start with a few simple definitions. In the following we will assume we are working over the well-behaved probability space $$\mathcal{P} = ([0,1], \mathcal{B}, \mu)$$, where $$\mu$$ is the Lebesgue measure on the Borel $$\sigma$$-algebra $$\mathcal{B}$$. 

A **real-valued stochastic process** $$X$$ is a random variable valued function such that $$X_t$$ is a real-valued random variable, or a measurable function from $$\mathcal{P}$$ to $$\mathbb{R}$$. We can think of $$t$$ as representing time, but this does not need to be the case.

A real-valued stochastic process is **stationary** when its unconditional joint probability distribution does not change when shifted in $$t$$. That is, for any $$\tau \in \mathbb{R}$$ and $$t_1, ..., t_n \in \mathbb{R}$$ we have that the joint distributions of the sets of random variables $$(X_{t_1}, ..., X_{t_n})$$ and $$(X_{t_1 + \tau}, ..., X_{t_n + \tau})$$ are the same. 

**Continuous time white noise** is often defined as a stationary real-valued stochastic process where all $$X_t = \mathcal{N}(0,1)$$ and for all $$\tau$$ we have that $$E[X(t)]E[X(t+\tau)]$$ is $$\sigma^2$$ when $$\tau=0$$ and $$0$$ otherwise. For simplicity we will assume $$\sigma=1$$. That is, for all $$t_1,t_2$$, the random variables $$X_{t_1}$$ and $$X_{t_2}$$ are uncorrelated standard normal random variables.

However, such a collection can not exist! To see this, let's define the collection of random variables $$Y_t = X_t * 1_{\|X_t\| \leq 1}$$. Then we have that $$Y_t$$ is square integrable, and therefore in $$L^2([0,1], \mu)$$. However, $$L^2([0,1], \mu)$$ is separable, and can therefore only countain countably many mutually orthogonal elements. This implies that not all $$X_t$$ can be mutually orthogonal.

## Working around the Problem

To resolve this, we need to use some pretty beefy mathematical machinery. Basically, while we can't define white noise to be a random variable valued function over $$t$$, we can define it as a random variable valued generalized function

To start, let's define a *Brownian Motion Process* $$\mathcal{B}$$ to be a stochastic process that satisfies:

- $$\mathcal{B}_0 = 0$$
- If $$0 < t_1 < t_2 < ... < t_n$$ then the random variables $$\mathcal{B}_{t_k} - \mathcal{B}_{t_{k-1}}$$ for $$k=1,2,...n$$ are independent. 
- For each $$t$$ and $$\tau >= 0$$ the random variable $$\mathcal{B}_{t+\tau} - \mathcal{B}_t$$ is normally distributed with mean $$0$$ and variance $$\tau$$
- For almost all $$\omega \in [0,1]$$, the function $$\mathcal{B}_t(\omega)$$ is everywhere continuous in $$t$$. 

It turns out that the formal derivative in $$t$$ of $$\mathcal{B}$$ is the white noise process. It isn't too hard to see why this should be the case: by the conditions above, the random variables formed from the increments in Brownian motion are independent and normally distributed. The differentiation process just continuous-ifies this. This suggests that we could reasonably hand-wave white noise to be the derivative in $$t$$ of the Brownian motion process. Of course, things are more complex than this. In fact, for almost every $$\omega \in [0,1]$$ the function $$\mathcal{B}_t(\omega)$$ is nowhere continuous in $$t$$. 

In order to resolve this, we need to switch from talking about functions to talking about [generalized functions](https://www.encyclopediaofmath.org/index.php/Generalized_function). A generalized function is a "linear functional on a space of test functions". This is a mouthful, but it's essentially just a linear mapping from a set of smooth functions of compact support (the test functions) into $$\mathbb{R}$$. We can think of a generalized function as behaving somewhat like a probability measure over the set of test functions. 

We can view any continuous function as a generalized function. For example, if we write the application of the generalized function corresponding to Brownian motion to the test function $$\psi$$ as $$(\mathcal{B}, \psi)$$ then we have:

$$(\mathcal{B}, \psi) = \int_{0, \infty} \mathcal{B}(t) \psi(t) dt$$

Note that $$(\mathcal{B}, \psi)$$ is itself a random variable that maps $$\omega \in [0,1]$$ to $$\mathbb{R}$$. Now we define the derivative of the generalized function $$F$$ to be the generalized function $$F'$$ such that $$(F', f) = -(F, f')$$. Therefore, the derivative of the generalized function corresponding to Brownian motion is the following random variable valued generalized function, which we can think of as a more formal definition of white noise:

$$(\mathcal{B}', \psi) = -(\mathcal{B}, \psi') = -\int_{0, \infty} \mathcal{B}(t) \psi'(t) dt$$

## References

The content in this post is primarily from:

- [This stackexchange answer](https://math.stackexchange.com/questions/1549807/showing-that-there-do-not-exist-uncountably-many-independent-non-constant-rando)
- [This stackexchange answer](https://math.stackexchange.com/questions/134193/what-is-meant-by-a-continuous-time-white-noise-process)
- [These lecture notes](http://ft-sipil.unila.ac.id/dbooks/AN%20INTRODUCTION%20TO%20STOCHASTIC%20DIFFERENTIAL%20EQUATIONS%20VERSION%201.2.pdf)
- [This book](https://onlinelibrary.wiley.com/doi/book/10.1002/9781118150443)





<!-- 



Once we are looking at things from this perspective, we see that we can 



We won't be able to define the white noise process as a function over $$t$$, but we will be able to define it as a .



First, to give credit where it is due, I've drawn parts of this post from  and [this](https://math.stackexchange.com/questions/134193/what-is-meant-by-a-continuous-time-white-noise-process) stachexchange answers.






Indeed, [some authors](https://onlinelibrary.wiley.com/doi/book/10.1002/9781118150443) choose to define white noise that way. 

Of course, things are more comp





We can also define white noise based on Brownian motion. The B


## Brownian Motion





 we can define the autocorrelation function $$\mathcal{R}_X(\tau) = E[X(t)X(t + \tau)]$$ 

- derivative of brownian motion, which is absolutely continuous
- i.i.d and uncountable independence

Derivative of Stochastic Process with independent increments and uncountable independence 
 -->