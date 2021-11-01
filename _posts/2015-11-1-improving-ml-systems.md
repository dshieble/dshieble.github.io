---
layout: post
title: Improving a Machine Learning System 
tags: [Machine Learning, Probability, Discriminative, Generative, Frequentist, Bayesian]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>


<!-- https://proceedings.neurips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf -->

Suppose you have been hired to apply state of the art machine learning technology to improve the Foo vs Bar classifier at FooBar International. Foo vs Bar classification is a critical business need for FooBar International, and the company has been using a simple system based on a decade-old machine learning technology to solve this problem for the last several years.

As a machine learning expert, you are shocked that FooBar International hasn't gotten around to modernizing this sytem, and you are confident that replacing the Foo vs Bar classifier with DeepMind's latest machine learning algorithm will dramatically improve system performance. You pull the Foo vs Bar training data into a notebook, spend a week or two experimenting with features and model architectures, and soon see a big jump in performance on the holdout set.

Next, you work with the engineering team to run an A/B test comparing your new model to the existing system. To your surprise, your new model substantially underperforms compared to the existing system.

This is a familiar story that anybody who has built machine learning models at a large company will recognize. Making measurable improvements to a mature machine learning system is extremely difficult. In this post, we will explore why. 


## General Issues

First, we will discuss several challenges that are common to most machine learning projects.

#### Justifying Infrastructure Investments

Most software systems carefully control which layers need to communicate with each other and which data needs to be exposed along each layer boundary. It is quite common for a new machine learning system to require breaking existing abstractions and connecting layers that were designed as separate. 

For example:
* A new feature normalization strategy may require exposing raw data to a part of the system that was designed to consume processed data
* Migrating a feedforward neural network to a graph neural networks may require accessing the features of a node's neighbors at inference time
* Training one model on the output of another may require configuring models to run sequentially rather than in parallel

Modifying software architecture and abstractions to support new products is common and healthy. However, it is difficult to execute these kinds of changes effectively before we have a clear understanding of what the end-state of our software architecture should be. Unfortunately, this is exactly the case with machine learning improvements. Until we can test the machine learning system in production, we cannot determine how much value it will bring. This kind of Catch-22 can dramatically slow down development and experimentation agility. In larger organizations where such a refactor may require multiple teams to prioritize the changes, this can lead to a state of paralysis.

In some situations it may be possible to build a modified version of the new machine learning system that operates within the constraints of the current software abstractions. For example, perhaps the fancy new model can execute in a batch job rather than in realtime. However, it is usually difficult to estimate how much this kind of modified design will handicap model performance. It is quite common for state-of-the-art machine learning systems that are deployed under such a handicap to underperform compared to a simpler system that has optimized for the abstractions of the software system it is running in.

<!-- 
ML modelers may choose to develop a modified version of their optimal machine learning solution that fits into the current software abstractions. Depending on the problem, this kind of concession may be large 

However, this leads to an unfair comparison. When we compare this 
 -->
<!-- If we cannot test the machine learning solution in production without making large infrastructure changes, then we cannot determine whether these changes would be worth the time, effort, and incident risk that they would entail.  -->



#### Distribution mismatch


It is very rare that the distribution of samples for which we have labels is the same as the distribution of samples for which we have to perform inference. For example:
* Click-through rate prediction models don't get labels on samples that the user did not see.
* Most content moderation systems receive feedback on only a tiny, typically non-representative subset of data.
* Most sensor analytics algorithms are built on top of labeled datasets that have unrealistically low noise levels.

In any of these scenarios, our model's performance on labeled data presents only a skewed view of how the model performs on all traffic. To make matters worse, it is quite common for data distributions to shift over time. In some circumstances these shifts can happen quite rapidly: it is not uncommon for models at large social networking companies to go stale within hours.

The combination of these effects can make it extremely difficult to draw conclusions about model performance improvements from offline results. In these situations we can sometimes use online A/B testing to draw more reliable conclusions by tracking metrics like revenue and report rate over all traffic. However, this can increase the iteration time required to make model improvements, which slows down progress substantially. 



#### Feedback Loops


In many circumstances the labeled data that our model receives is dependent on the predictions it generates. Some classic examples of this situation include:

* Most recommender systems don't receive user feedback on any sample that the user did not see..
* Systems that effectively detect and penalize users for certain behaviors may cause users to modify their behavior to avoid penalty.
* If a content moderation system is trained on user reports, then increases in system coverage may elicit decreases in model training data as user report rates decrease.

This is a particularly insidious kind of distribution mismatch, since it can give rise to extremely complicated system dynamics. In these situations it can be nearly impossible to draw conclusions about model performance improvements from offline results. 

We can sometimes minimize the impact of feedback loops by deriving training data from specialized pipelines that do not use the machine learning model directly. However, this strategy can be difficult to scale. Furthermore, this can sometimes hurt model performance by preventing the model from learning from its mistakes. 







#### Unknown tight couplings
    - Ranker and light ranker
    - Downstream models











## Adding new features or improving existing features

Next, we will explore some of the unique challenges of machine learning experiments that are based on new features. 

#### Time travel
#### Online version vs Offline version
  - Serialization difference (execution engine)
  - Storage differences (key-value store vs offline store)
#### Feature versioning
#### Feature freshness





## A/B testing
  - Small traffic affecting model training
    - Not learning own mistakes
  - Hidden shared variables
  - Multiple comparisons







## Unknown long-term tradeoffs
  - Noise resiliency
  - Change responsiveness






<!-- 



Other Issues
  - Track experiments
  - Reliable data pipelines



Deployment
  - Offline/Online Mismatch

Performance Decay
  - Upstream changes
  - Feedback loops

Shipping Improvements
  - Backtesting
  - Backwards Compatibility


 -->