---
layout: post
title: Compositional Structures in Machine Learning
tags: [Machine Learning, Neural Networks, Category Theory, Composition]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

As researchers apply Machine Learning to increasingly complex tasks, there is mounting interest in strategies for combining multiple simple models into more powerful algorithms. In this post we will explore some of these techniques. We will use a little bit of language from Category Theory, but not much.

In the following discussion we will use the following notation and terminology: Machine Learning models are functions of the form $$D \rightarrow (X \rightarrow Y)$$ where $$D$$ is a dataset and $$(X \rightarrow Y)$$ is a function that maps samples in the space $$X$$ to samples in the space $$Y$$. The dataset $$D$$ may contain pairs of samples $$(x,y) \in X \times Y$$ (supervised learning), just samples $$x \in X$$ (unsupervised learning) or anything else. This is of course a very limited perspective on Machine Learning models. Although this post will focus mainly on supervised and unsupervised learning, there are many more examples of composition in reinforcement learning and beyond. 

### Side-by-Side Composition
The most general way to combine Machine Learning models is to just place them "side-by-side". There are a few ways to do this:

#### Product
Given models of the forms $$T_1: D_1 \rightarrow (X_1 \rightarrow Y_1), T_2: D_2 \rightarrow (X_2 \rightarrow Y_2)$$ we can attach them in parallel to get a model $$h: D_1 \times D_2 \rightarrow (X_1 \times X_2 \rightarrow Y_1 \times Y_2)$$. At both training and inference time, the composite model independently executes the component models. We can think of this sort of composition as zooming out our perspective to see the two separate and noninteracting models as part of the same whole. In [Backprop as Functor](https://arxiv.org/pdf/1711.10455.pdf) the authors define this sort of composition to be the monoidal product in their category $$Learn$$. 

For example, say we have a software system that contains two modules: one for training a linear regression on driving records to predict insurance premiums and one for training a decision tree on credit history to predict mortgage approvals. We can think of this system as containing a single module that trains a linear regression $$\times$$ decision tree on pairs of driving records and credit history to predict pairs of insurance premiums and credit history.


#### Ensemble
Given a set of Machine Learning models that accept the same input, there are a number of side-by-side composition strategies, called [ensemble methods,](http://web.engr.oregonstate.edu/~tgd/publications/mcs-ensembles.pdf) that involve running each model on the same input and then applying some kind of aggregation function to their output. For example, if the models in our set all produce outputs in the same space, we could simply train them independently and average their outputs. The models in an ensemble are generally trained in concert, perhaps on different slices of the same dataset.


### Input-Output Composition
Another way to combine Machine Learning models is to use the output of one model as the input to another. That is, say we have two models $$T_1: D_1 \rightarrow (X \rightarrow Y), T_2: D_2 \rightarrow (Y \rightarrow Z)$$ that we combine into a model $$h: D_3 \rightarrow (X \rightarrow Z)$$. At inference time, $$h$$ operates on some $$x \in X$$ by first running the trained version of $$T_1$$ to get a $$y \in Y$$ and then running the trained version of $$T_2$$ on $$y$$ to get the output $$z \in Z$$. Within this framework, there are a number of ways that we can train $$T_1$$ and $$T_2$$:

#### Unsupervised Feature Transformations
The most straightforward form of input-output composition is the class of unsupervised learned feature transformations. In this case $$D_1$$ is a dataset of samples from $$X$$ and $$T_1: D_1 \rightarrow (X \rightarrow Y)$$ is an unsupervised Machine Learning algorithm. In unsupervised feature tranformations the learning processes of $$T_1$$ and $$T_2$$ proceed sequentially: $$T_2$$ is trained on the output of $$T_1$$, and this training does not begin until $$T_1$$ is fully trained. There are no assumptions on the structure of $$T_2$$, and the dataset $$D_2$$ is a set of samples in $$Y \times Z$$ that we create from the trained version of $$T_1$$ and a dataset of samples in $$X \times Z$$.

Some examples of this include:
- **[Standardization](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html#sklearn.preprocessing.StandardScaler)**: $$T_1$$ learns the means/variances of each component of $$X$$ and transforms samples from $$X$$ by rescaling them to be zero-norm and unit variance.
- **[PCA](https://scikit-learn.org/stable/modules/decomposition.html#pca)**: $$T_1$$ learns a linear projection from $$X$$ to a subspace $$Y$$.
- **[GMM](https://scikit-learn.org/stable/modules/mixture.html#mixture)**: $$T_1$$ learns a mapping from $$X$$ to the space $$Y$$ of vectors of posterior probabilities for each mixture component.


#### Supervised Feature Transformations
A similar but slightly more complex form of input-output composition is the class of supervised learned feature transformations. In this case $$D_1$$ is a dataset of samples from $$X \times Z$$ and $$T_1: D_1 \rightarrow (X \rightarrow Y)$$ is a Machine Learning algorithm that transforms samples from $$X$$ into a form $$Y$$ that may be more convenient for a model that aims to generate predictions in $$Z$$ to consume. Just like in unsupervised feature tranformations, the learning processes of $$T_1$$ and $$T_2$$ proceed sequentially and we construct $$D_2$$ from $$T_1$$ and a dataset of samples in $$X \times Z$$. 

Some simple examples of this include:
* **[Feature Selection](https://scikit-learn.org/stable/modules/feature_selection.html)**: $$T_1$$ transforms $$X$$ by removing features that are not useful for predicting $$Z$$.
- **[Supervised Discretization](http://ai.stanford.edu/~ronnyk/disc2.pdf)**: $$T_1$$ learns to represent the samples from $$X$$ as vectors of one-hot encoded bins, where the bins are chosen based on the relationship between the distributions of the components of $$X$$ and $$Z$$.

A more complex example of a supervised feature transformation is the vertical composition of decision trees. If we have two sets of decision rules from which we can build decision trees, we can combine them to form a composite decision tree that first applies all of the rules in the first group and then applies all of the rules in the second group.
<!--
If we do this we can think of the first decision tree as projecting the features from
  [group_1_rules] + [group_2_rules] -> [output_of_first_tree] + [group_2_rules]
-->

<!-- #### Back-And-Forth Training-->


#### End-to-End Training
End-to-End training is probably both the most complex and most studied form of input-output composition of Machine Learning models. [This paper](https://arxiv.org/abs/1907.08292) and [this paper](https://arxiv.org/pdf/1711.10455.pdf) and [this paper](https://arxiv.org/pdf/1804.00746.pdf) all build categories on top of this kind of composition.


In both unsupervised and supervised feature transformations, the training process for $$T_2$$ does not begin until $$T_1$$ is fully trained. In contrast, in end-to-end training, we train $$T_1$$ and $$T_2$$ at the same time from a set of samples in $$X \times Z$$. We never explicitly construct the datasets $$D_1$$ or $$D_2$$. In general, we need our Machine Learning models to have a special structure in order to employ this strategy. For example, the [Backprop as functor](https://arxiv.org/pdf/1711.10455.pdf) paper defines the notions of request and update functions to characterize this. Because of the chain rule, we can define these functions and employ end-to-end training whenever our models are parameteric and differentiable.

Naturally, the clearest example of end-to-end training is the composition of layers in a neural network, which we train with [Backpropagation](https://en.wikipedia.org/wiki/Backpropagation).
<!-- , which is a special case of reverse-mode [Automatic Differentiation](https://en.wikipedia.org/wiki/Automatic_differentiation). -->


### Meta-Learning
In meta-learning, or learning to learn, the training or "update" function for one Machine Learning model is defined by another Machine Learning model. In certain cases, like those described in [this paper](https://arxiv.org/pdf/1606.04474.pdf), we can define a notion of composition where $$T_1 \circ T_2$$ is a model with an inference function equivalent to that of $$T_1$$ and a training function defined based on $$T_2$$'s inference and training functions. This is described in more detail for the parametric and differentiable case [here.](https://pdfhost.io/v/EKIVakrfK_Categorical_Metalearningpdf.pdf)

### Conclusion
This is just a small sample of techniques for building complex models from simple components. Machine Learning is growing rapidly, and there are many more strategies for model composition that we will not discuss here. Thanks for reading!


<!-- That is, a meta-learner is of the form $$T: D \rightarrow (D \rightarrow (X \rightarrow Y))$$
 -->




 <!-- What about the composition of Markov Decision Processes? 
 -->




















































<!-- 

There are many ways that we can put together Machine Learning models

What about decision tree composition? We can always stick a new decision tree onto the leaf of a decision tree and apply additional rules to samples that make it to that leaf
    - I think this is input-output 

- also, models that represent underlying compositional or hierarchical structures in the data they model
https://arxiv.org/pdf/1910.09113.pdf




Category theoretic frameworks for Machine Learning build  

(tensor product in Learn) where we just define the features and outputs to be the unions of the features and outputs. Training algos are also side-by-side. This is sort of like co-deployment
    \item Voting composition where multiple models run on the same input and we somehow combine their outputs (concatenate, sum, etc)



\begin{itemize}
    \item 
    \item Meta-Learning, where the output of one model defines the update function for another
    \item Input-Output Composition where the output of the first model is the input to the second. There are a few versions of this:
    \begin{itemize}
        \item Preprocessing, where the first model either does not need an output signal to train (normalization) or uses the same output signal as the second model (MDL). In this case we train the first model first and the second model second, using the first model's output for training. 
        \item Sequential training (e.g. EM), where we alternate between freezing the models and training them based on the inputs/outputs of the other model 
        \item End-to-End training (backpropagation), where we train both models at the same time using the ``update'' and ``request'' signals from the second model as supervision for the first model. It's possible we can only express this in a ``step-by-step'' fashion.
    \end{itemize}
    \item 
\end{itemize}
Unsupervised models like GPs or GMMs? Random forests?




 (Of course, things get a little messy in this example if the sets of people for whom we have insurance data is not the same as the set of people for whom we have credit history, but this is an implementation detail rather than an issue with the abstract notion of side-by-side composition) -->