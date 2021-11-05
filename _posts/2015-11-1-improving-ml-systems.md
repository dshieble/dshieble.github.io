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


<!--
https://proceedings.neurips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf
TODO: 

-->

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


#### Distribution mismatch


It is very rare that the distribution of samples for which we have labels is the same as the distribution of samples for which we have to perform inference. For example:
* Click-through rate prediction models don't get labels on samples that the user did not see.
* Most content moderation systems receive feedback on only a tiny, typically non-representative subset of data.
* Most sensor analytics algorithms are built on top of labeled datasets that have unrealistically low noise levels.

In any of these scenarios, our model's performance on labeled data presents only a skewed view of how the model performs on all traffic. To make matters worse, it is quite common for data distributions to shift over time. In some circumstances these shifts can happen quite rapidly: it is not uncommon for models at large social networking companies to go stale within hours.

The combination of these effects can make it extremely difficult to draw conclusions about model performance improvements from offline results. In these situations we can sometimes use online A/B testing to draw more reliable conclusions by tracking metrics like revenue and report rate over all traffic. However, this can increase the iteration time required to make model improvements, which slows down progress substantially. 



#### Feedback Loops


In many circumstances the labeled data that our model receives is dependent on the predictions it generates. Some classic examples of this situation include:

* Most recommender systems don't receive user feedback on any sample that the user did not see.
* Systems that effectively detect and penalize users for certain behaviors may cause users to modify their behavior to avoid penalty.
* If a content moderation system is trained on user reports, then increases in system coverage may elicit decreases in model training data as user report rates decrease.

This is a particularly insidious kind of distribution mismatch, since it can give rise to extremely complicated system dynamics. In these situations it can be nearly impossible to draw conclusions about model performance improvements from offline results. 

We can sometimes minimize the impact of feedback loops by deriving training data from specialized pipelines that do not use the machine learning model directly. However, this strategy can be difficult to scale. Furthermore, this can sometimes hurt model performance by preventing the model from learning from its mistakes. 





#### Unknown tight couplings

One of the most insidious aspects of production machine learning systems is the potential for seemingly independent systems to have hidden tight couplings. This can make experimentation challenging. Changing one system without changing the other will cause performance to degrade, and changing both systems at the same time is often error prone and coordination intensive. Some examples include:

* Once a feature pipeline is developed and made available for model utilization, any change to that pipeline (even correcting errors!) risks damaging the performance of models that consume that feature. This forces ML engineers to version all feature changes, which causes feature pipelines to grow into unwieldy monsters extremely quickly. 
* In large scale recommendation systems it is common for a light ML model or heuristic-based candidate generation system to select the set of candidates that a heavy machine learning model chooses between. Any change to the candidate generation system would affect the distribution of samples that are fed to the heavy model, which could affect that model's performance.
* It is quite common for some models, such as semantic models or object detection models, to produce signals that other models consume as features. In this situation any change or improvement to the upstreams models could damage the performance of the downstream models that consume their predictions.  

When designing or working with an ML system, it is extremely important to be aware of the tight couplings that exist. In certain situations it can be beneficial to introduce redundant components in a system in order to relax the number of components that are tightly coupled. 











## Adding new features or improving existing features

A machine learning model is only as powerful as the features it is trained with. As a result, one of the most important parts of improving a machine learning system is improving the core feature set. However, experimenting with new features or feature improvements presents a unique set of challenges.





#### Online version vs Offline version

Probably the most straightforward challenge of adding new features is offline/online mismatch. This problem arises when the processes by which features are derived from raw data are different between the systems that train and serve that model. 

This problem is particular common when a model is trained and deployed in different environments. For example, suppose we train a model in a notebook on a cloud machine but deploy it to run in a user's browser. The feature computation code in these two settings may be written in different languages, and slight differences in serialization, tokenization, rounding, etc are very common.

Even in the situation that the feature serving code is identical between the training and inference pipelines, it is common for the data itself to be different. For example, it is often most cost efficient for organizations to use low-latency key-value stores like redis or bigtable to serve features online but to use data warehousing solutions like hadoop or bigquery to manage features for offline model training. It is possible for substantial differences to exist between how data is written, stored, and accessed between these different tools. 




#### Time travel

Another most well known challenges with feature experimentation is time travel. Time travel arises when we use a feature that is computed at time t2 to train or evaluate a model on a sample that was derived at some time t1 != t2. This can skew the feature distribution and lead to mismatch between the training and inference feature distributions. This is particularly risky when t1 < t2, since it is possible for the label to "leak" into the feature distribution.

For example, suppose we are training a click prediction model, and one of the features in the model is the number of clicks that the user has performed in the last 30 days. Now suppose we use the value of this feature at time t2 to predict the probability of a click at t1 where t1 < t2. The model will likely overindex on the importance of this feature, since the user's decision to click at time t1 is already included in the value of the feature at time t2. 

Time travel is easy to avoid when the set of features that we use is constant. We can simply log the feature set at prediction time, and then use the logged features for training and evaluation. However, we cannot use this strategy when we add a new feature or want to experiment with a new strategy for computing a feature. In these situations the only recourse may be to start logging the new features for a while before using them to train a model. 






#### Feature freshness

In most machine learning applications we can divide features into two categories:
* Static features that change slowly and don't need to be updated often (e.g. user age, text content, image content)
* Dynamic features that change quickly and rely on regular updates (e.g. last user action, today's weather)

If a model is trained to expect that dynamic features are computed with a 2-hour lag, then either system outages that increase that lag or performance improvements that reduce that lag can damage model performance. 







## A/B testing

When engineers and data scientists optimize machine learning systems they often focus on improving offline metrics like cross entropy, ROC-AUC, or mean square error on a static holdout set. However, it is rare that these are the most important metrics from a business perspective. Usually the most important business metrics are things like revenue, click-through-rate, or customer report rate. However, it can be difficult to predict the impact of machine learning system improvements on these metrics. 

Generally the most reliable way to measure this impact is to run an online A/B test. That is, we launch our new model on a small percentage of traffic and monitor the impact on core business metrics. It is usually a mistake to ship a model or feature improvement without going through this stage. In this section we will discuss some of the most common challenges and pitfalls with running A/B tests on machine learning systems. 





#### Small traffic affecting model training

In many applications the set of labeled samples that we use to train our models is heavily influenced by the model's behavior. For example: 
* In content moderation applications the samples that the model selects for human review will receive manual labels
* In recommendation applications users have the opportunity to provide implicit or explicit feedback on the samples that the model recommends them 

However, it is common for A/B tests to only use a small percentage of traffic (1-2%) per bucket. This makes it difficult to train any machine learning model entirely on samples from the A/B test, so we are unlikely to capture this self-influence from the A/B test results. This also makes certain kinds of machine learning system improvements, such as improvements to exploration policies, essentially impossible to test in an A/B setting.



#### Hidden shared variables


When we run an A/B test, we need to logically separate the samples that model A runs on from the samples that model B runs on. However, it is extremely difficult to separate these samples entirely. Usually a collection of feature flags will control the code paths for fetching features and serving models A and B, but all samples will share many resources like databases, compute clusters, budgets, or other models. As a result, the behavior of model A can influence the product metrics that we measure over the samples served by model B. This can make it extremely difficult to interpret the results of an A/B test. 


Here are several examples:
* Suppose that model B has substantially lower latency than model A, and we expect that this latency will translate to an improvement in business metrics due to faster system response times. Suppose also that models A and B are served by the same cluster, that requests to this cluster are batched, and that the batched requests are not separated by experimentId. We will not be able to observe this latency improvement in an A/B test, since the cluster response times for traffic served by model B will be affected by model A's latency. 
* Suppose that our content moderation system is limited by the bandwidth of human reviewers, who can only take action on the top N reports that are sent to them. Now suppose that models A and B are calibrated differently, such that samples that model B reviews are 2x more likely to be sent to a human reviewer than samples that model A reviews. If the human reviewers are not stratified by experiment, then the majority of human review will take place on model B's samples, which can substantially skew results.
* Suppose we are running a programmatic advertising auction in which advertisers spend a fixed budget over the course of a day by placing bids on user impressions. Now suppose that we use machine learning to set advertiser bids, and that we apply model A to a portion of auctions and model B to a different portion of auctions. If model B is overcalibrated relative to model A, then advertisers will spend a greater portion of their budget on the auctions that model B serves, which could artificially inflate metrics like revenue and click-through-rate. 
* Suppose that we use a machine learning model to process raw sensor data, and that a classification model elsewhere in the system consumes this processed data in order to classify user activity. If we run an A/B test on the upstream processing model, the classification model is likely to perform better on the samples whose sentiment was classified in a way that is most similar to the data that the model was trained on. This can cause a model that is actually worse at sentiment classification task to show better business metrics. 


One of the most insidious aspects of these shared variables is that they are hidden. It is uncommon for a data scientist experimenting with a new model to deeply understand every aspect of the systems that handle model deployment or resource management. As a result, many A/B test analyses are performed as if buckets are independent and these couplings do not exist. This is counterproductive for an organization trying to make the best decisions.


#### Multiple comparisons

One of the most well-known limitations of A/B tests is that guarantees around statistical significance fall apart once we start making mutiple comparisons. That is, if we track multiple metrics or run multiple versions of the same test, then it is very likely that we will see p<0.05 results differences between buckets that are due to noise.

Computing statistical significance for a test in which we make multiple comparisons requires estimating the family-wise error rate, or the probability of making at least one false discovery along all of the comparisons we perform. However, this is tricky to get right. Although can use techniques like the [Bonferroni correction](https://en.wikipedia.org/wiki/Bonferroni_correction) or [Holm-Bonferroni method](https://en.wikipedia.org/wiki/Holm%E2%80%93Bonferroni_method) method to compute an accurate p-value in that case that each comparison is completely independent, this assumption is usually far too strict, and these methods apply an extremely high bar for statistical significance for double digit comparisons. It is possible to relax the bar on statistical significance if we assume that some comparisons are closely correlated with each other, but this is challenging to model and often subjective. 

As a result, the presence or absence of statistical significance tends in practice to be only a data point in the overall analysis of an A/B test. We need to complement it with other tools like:
* Stratification: Did we see consistent improvements across time periods, geos, user segments?
* Fundamental Analysis: Do we have an explanation for this effect, and do the movements of other metrics/other tests support that explanation? 




## Conclusion

Machine learning systems can be incredibly powerful. They enable software systems to operate successfully in a variety of domains and unlock entirely new kinds of products. However, they are extraordinarily costly to maintain and improve. The experimental and cross-cutting nature of machine learning development is often at odds with standard software processes. Hidden couplings slow down development and can cause even simple changes to produce unexpected results. The difficulty of assessing impact with A/B testing often frustrates progress, especially in larger organizations.

We have only scratched the surface of the challenges of machine learning development in this post. For example, machine learning systems often demonstrate emergent behaviors that no single person fully understands or predicts. This can lead to issues with [bias and fairness](https://arxiv.org/pdf/1908.09635.pdf) as well as [security and reliability](https://dependablesecureml.github.io/). 

















<!-- 
ML modelers may choose to develop a modified version of their optimal machine learning solution that fits into the current software abstractions. Depending on the problem, this kind of concession may be large 

However, this leads to an unfair comparison. When we compare this 
 -->
<!-- If we cannot test the machine learning solution in production without making large infrastructure changes, then we cannot determine whether these changes would be worth the time, effort, and incident risk that they would entail.  -->



<!-- 



## Unknown long-term tradeoffs

Even after a model is successfully launched to production, it is quite common for its performance to erode over time. In this section we will explore how this happend and wha

  - Noise resiliency
  - Change responsiveness




 -->

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