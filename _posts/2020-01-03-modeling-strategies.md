---
layout: post
title: What are you modeling? Discriminative or Generative? Frequentist or Bayesian?
tags: [Machine Learning, Discriminative, Generative, Frequentist, Bayesian]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

There are a preponderance of ways to characterize Machine Learning algorithms. This is a direct consequence of the rich history, broad applicability and interdisciplinary nature of the field. In this post, we will explore the differences between discriminative vs generative and frequentist vs bayesian algorithms.

One of the clearest ways to characterize Machine Learning models is based on the structure of the data and the feedback that the model receives. For example, supervised learning, unsupervised learning, semi-supervised learning and reinforcement learning all interpret data and receive feedback differently. For the purpose of simplicity, we will focus exclusively on supervised learning in this post.
 
In a supervised learning task, we begin by defining a function $$f: \mathbb{R}^p \times \mathbb{R}^n \rightarrow \mathbb{R}^m$$ that accepts a parameter vector $$v \in \mathbb{R}^p$$ and an input vector $$x \in \mathbb{R}^n$$ and returns an output vector $$y \in \mathbb{R}^m$$. Given a set of labeled examples $$S = \{(x_1, y_1), (x_2, y_2), ...\}$$ where each example is from some distribution $$\mathcal{D}$$ over $$\mathbb{R}^n \times \mathbb{R}^m$$, we aim to determine a parameter value $$v \in \mathbb{R}^p$$ such that $$f(v, x_i)$$ is a good approximation for $$y_i$$ for all $$(x_i, y_i)$$.

If we make the assumption that there exists some value of $$v \in \mathbb{R}^p$$ such that $$f(v,x_i) = y_i$$ for any sample drawn from $$\mathcal{D}$$, then there is no need to model $$v$$, $$x$$, or $$y$$ probabilistically and we can treat this problem as search or function optimization. However, this scenario is uncommon. More frequently, one or both of the following two scenarios are the case:
* There is "label noise", or some input values $$x$$ such that for distinct $$y_1,y_2$$ there is a nonzero probability that either $$(x,y_1)$$ or $$(x,y_2)$$ will be drawn from $$\mathcal{D}$$. Alternatively, we can say that for any fixed $$x$$ the "true" value of $$y$$ is a nondegenerate probability distribution.
* The true function $$f'$$ that determines $$y$$ from $$x$$ cannot be expressed as $$f(v, x)$$ and we choose to model $$f'(x) - f(v, x)$$ with a probability distribution.

Now let's assume that we are in one or both of these scenarios. We will need to model the output vector $$y$$ probabilistically in order to find the best value of $$v$$. However, we have the freedom to determine whether we want to model $$v$$ and/or $$x$$ probabilistically as well. 
<!-- We can characterize Machine Learning models based on whether they also model . -->



## Generative vs Discriminative
The key distinction between a *discriminative* and a *generative* machine learning algorithm is whether it models $$x$$ probabilistically. A discriminative supervised machine learning algorithm assumes that $$x$$ is fixed and learns the conditional distribution $$P(y ; x)$$ (in frequentist notation, terms to the right of the semicolon are considered fixed and are not modeled probabilistically). A generative supervised machine learning algorithm probabilistically models $$x$$ and learns the joint distribution $$P(x, y)$$. We can use the distribution that a generative algorithm learns to make predictions of $$y$$ from a fixed $$x$$ with Bayes Rule. 

Since generative algorithms model the joint distribution, we can use them to draw samples from this distribution. This can be useful for developing a better understanding of our data. However, for the task of predicting $$y$$ from $$x$$, discriminative models are likely perform best unless there is a very small amount of data. In [this paper](http://ai.stanford.edu/~ang/papers/nips01-discriminativegenerative.pdf) the authors conclude that:
> (a) The generative model does indeed have a higher asymptotic error (as the number of training examples become large) than the discriminative model, but (b) The generative model may also approach its asymptotic error much faster than the discriminative model – possibly with a number of training examples that is only logarithmic, rather than linear, in the number of parameters.



## Frequentist vs Bayesian
A key distinction between a *frequentist* and a *bayesian* machine learning algorithm is whether it models $$v$$ probabilistically. A frequentist supervised machine learning algorithm assumes that $$v$$ is fixed. That is, the frequentist algorithm is based on the assumption that there is some unobserved true value of $$v$$ such that the data is generated by the function $$f(v, -)$$. In contrast, a bayesian machine learning algorithm models $$v$$ probabilistically and operates based on the assumption that the data generation process includes a step where $$v$$ is drawn from some prior distribution. 

The fact that bayesian algorithms assume that the "true" value of $$v$$ is drawn from a distribution makes it easier to incorporate domain knowledge into the algorithm training procedure. For example, if we suspect that the value of one element of $$v$$ will be of a different scale than the value of another element, we can construct a prior distribution that reflects this. 


## Summary

The following diagram, similar to the one [here](https://lingpipe-blog.com/2013/04/12/generative-vs-discriminative-bayesian-vs-frequentist/), lays out these characterizations.

|                    | Frequentist     | Bayesian                              |
|--------------------|-----------------|---------------------------------------|
| **Discriminative** | p(y ; x, v) | p(z, v ; x) = p(z \| v ; x) * p(v) |
| **Generative**     | p(y, x ; v) | p(z, x, v) = p(z, x \| v) * p(v)   |

















<!-- 




in this paper, the authors suggest that the generative approach can be beneficial when there is less data


The key difference between Generative models and Discriminative models is the decision of whether to model 


In practice, most Machine Learning algorithms model the output vector $y$ probabilistically 

In a noise free learning model where the samples are , we can assume 

Supervised learning aims to predict a target value from input features, unsupervised learning aims to build a model for input features themselves and 


Machine Learning has broad applicability and spans a range as disciplines. 

are a lot of different ways to characterize Machine Learning algorithms. 
Stick to supervised learning
Probabilistic modeling, the three components (parameters, input)

it's a common misconception that only bayesian algorithms are probabilistic and frequentist are deterministic - we can get confidence bounds from frequentist as well


Why would we prefer generative to discriminative? frequentist to bayesian? 

Popular techniques (MCMC vs ) -->