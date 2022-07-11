---
layout: post
title: Resilient Machine Learning
tags: [Machine Learning, Resilient, Mistakes]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>


A boxer who only learns to punch a bag will fail in the ring, and a ML model that only learns with clean data will fail in production. We need to show our model what it feels like to get punched in the face if we want it to perform well when data distributions drift in production. 

![Boxing is dangerous](/img/boxer_painting.png)

Every software system experiences incidents. Service outages, data pipeline delays, sudden load, and hundreds of other risks threaten uptime and damage the user experience. Mature development teams plan for these incidents and build software that adapts to unexpected changes in system behavior and availability.

Unfortunately, this kind of risk mitigation is notoriously difficult in an ML system. Small changes to model inputs can cause large and unexpected changes to model outputs. Incidents that touch ML systems therefore have a larger blast radius and longer recovery times. This critical vulnerability has slowed the adoption of machine learning technologies in safety critical applications.


## The Problem

ML systems behave poorly when the production data distribution differs from the training data distribution.

<!-- outage -->
Suppose our model consumes features that are served by a feature store. Suppose also that the samples in our training dataset are sourced from a period during which this system is fully operational. If this feature store fails under heavy load and begins to return default values we can expect our model to fail as well. 

<!-- upstream model retrains -->
Next, suppose an upstream model extracts entities from images or text which our model consumes as categorical features. If this upstream model is kept constant while we train our model but retrained and relaunched after our model is in production our model's performance may degrade. 


## Data Distribution Drift

Given the modeling task "predict Y given X" there are two distinct types of data distribution drift to be aware of.

The first is covariate drift, or changes in P(X). This can cause samples to move from a region of X where our model performs well to a region where our model performs poorly. We may see covariate drift when a large new customer is onboarded to an enterprise software product. The best way to handle covariate drift is to retrain and relaunch models automatically. 

The second is concept drift, or changes in P(Y\|X). Both the outage and upstream model retraining circumstances described above are instances of concept drift. In the next two sections we will focus on strategies to minimize the impact of this kind of drift


## Training and Testing

An ML model is a reflection of the task we train it to solve. By cleverly introducing noise to the training process we can build models that perform well even during software incidents. We will dig into the best strategies to engineer tasks for robust and resilient models. 

Suppose one of the features that our model expects tracks whether a user attribute matches any of the categories in a configuration file (e.g. phrase matches, list of reserved usernames, list of known events, etc). As users update this file we expect that the joint distribution of this feature and the model label Y will change as well. This kind of gradual concept drift is extremely common.

We want our ML model to "understand" that this distribution might change. We can accomplish this with a simple recipe:
* Train our model on logged features over a long period of time
* Automatically retrain and redeploy our model as frequently as possible

By forcing our model to perform well on samples hydrated from both the current logic of this feature and previous iterations of this feature we can build a model that
<!-- does not expect this feature to have low variance and -->
is more resilient to data drift. We can evaluate the effectiveness of this technique by monitoring the model's performance over long periods of time on logged predictions. 

However, this strategy may not be enough. If no feature outages occur during the time period that we source training samples our model will not perform well when an outage happens. We can force our model to learn this behavior by applying the following transformation to the training dataset:
* Identify the K features that are at risk of a production outage
* Copy N samples randomly from the training dataset
* For each copy replace one or more of the K features with its default value
* Add the copies to the training dataset

We can evaluate the effectiveness of this technique by applying the same treatment to the testing dataset and evaluating the model's performance on the corrupted testing samples.



<!-- 
TODO 
## Feature Representations

Certain feature encoding strategies are more resilient to sudden distribution shifts than others. For example, models trained with clever default values or hashed bucketized features can be particularly resilient to localized feature outages.  We will discuss the dynamics that drive this phenomenon.


## Keyed Lookup Features
Smart default values
  * Cold start
  * Outages
Enough samples populated in training

## Categorical Features
Feature hashing vs One-Hot Encoding
  - If you train the model over a long enough period of time it will learn resiliency to these hash collisions
One-Hot encoding applies a more clean separation between "in the vocabulary" vs "out of the vocabulary". 


 -->










<!-- 


  TODO: Find venues to give a talk on this 


<Abstract>



----------------- Resilient Machine Learning -----------------

Every software system experiences incidents. Service outages, data pipeline delays, sudden load, and hundreds of other risks threaten system uptime and damage the user experience. Mature development teams plan for these incidents and build software that adapts to unexpected changes in system behavior and availability. Teams working on safety critical applications sometimes spend more time mitigating these risks than working on everything else put together.

Unfortunately, this kind of risk mitigation is notoriously difficult in a machine learning system. A small change to model inputs can cause large and unexpected changes to model outputs. As a result, software incidents that touch ML systems tend to have a larger blast radius and longer recovery times. This critical vulnerability has slowed the adoption of machine learning technologies in safety critical applications.

In order for machine learning to continue to drive impact in new applications we will need to address this problem directly. We start with testing. ML is software, and good tests are an irreplaceable tool for building a resilient system. We will explore how to design end-to-end simulations to assess our models' resilience.

Next, certain feature encoding strategies are more resilient to sudden distribution shifts than others. For example, models trained with clever default values or hashed bucketized features can be particularly resilient to localized feature outages.  We will discuss the dynamics that drive this phenomenon.

Finally, an ML model is a reflection of the task we train it to solve. By cleverly introducing noise to the training process we can build models that perform well even during software incidents. We will dig into the best strategies to engineer tasks for robust and resilient models. 



----------------- 



Cybersecurity defenses need to be bulletproof. A single mistake can sink a company. In this talk we will dive into how we can design extremely reliable and resilient AI systems that bolster cyber defenses. 


 than models trained exclusively with one-hot encoded categorical features or normalized continuous features.
- One-hot encoded categorical features can adapt to new distributions 



Unfortunately, 



Machine learning models are notoriously unreliable. Even the most powerful and accurate models can experience massive performance degradations when data distributions shift. 

Feature serving outages, data pipeline delays, or even user behavior patterns

-->











<!-- 




- We can make our systems resilient to these changes by training the model on noisy data with production data dropouts
  - Cost: if the noise we introduce is too high, the model might trust the production system less than it should and have worse performance in the noiseless scenario
- We can assess the effectiveness of this strategy with testing. ML is software, and good tests are an irreplaceable tool for building a resilient system. We can validate the performance of an ML model in an outage situation by simulating the outage and testing performance directly 

Regular retraining

# Distribution Shift



Examples include:
* A feature that tracks whether a user attribute matches any of the categories in a configuration file (e.g. phrase matches, list of reserved usernames, list of known events, etc)
* An upstream model that is regularly retrained
* New values of known categorical features (user ids, company ids)
* New distributions




If we train our model only on clean data, it will likely fail to generate good results when fed corrupted data.
- A bad state for an ML system to end up in is one where the system will fail when any input data stream is corrupted
-


- ML model trained on feature store features
  - If the distribution of this system is stable during training and shifts in production, the ML model may react poorly in production
- ML model trained on feature store features
 -->

