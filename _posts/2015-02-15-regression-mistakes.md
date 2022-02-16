---
layout: post
title: Regression and Mistake Dynamics
tags: [Machine Learning, Regression, ML]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>



Many real world problems can be framed as regression: use a collection of features $$X$$ to predict a real-valued quantity $$y$$. However, this framing can obfuscate a very important detail: which kinds of mistakes are most important to avoid? Many factors can influence this, including how the predictions will be used, the configuration of existing systems, and the safeguards that are in place.

Some examples include:
* A system that external users query to estimate the value of their illiquid assets. It is more important that this system to generates reasonably good predictions 99% of the time than that it never makes a massive mistake.
* A high frequency trading system that estimates the potential return of diferent strategies and executes the optimal strategy automatically. A single massive mistake can bankrupt the trading firm, so it is critical that this never happens. 
* A recommendation system that ranks items by their predicted user rating. It is entirely unimportant if the system consistently predicts that users will assign a much larger/smaller rating than they actually do as long as errors are consistent. 


There are a few metrics that are quite common to use in practice
* The Mean Square Error $$MSE(\mathbf{X}, \mathbf{y}) = avg (f(X_i) - y_i)^2$$ and its normalized variant [R-Squared](https://danshiebler.com/2017-6-25-metrics) are common. Both weigh large mistakes dramatically larger than small ones, and it is quite common for model $$f_1$$ to have a better MSE and R-Squared than model $$f_2$$, but to generate worse predictions on 95% of cases.
* The Mean Absolute Error $$MAE(\mathbf{X}, \mathbf{y}) = avg \vert f(X_i) - y_i \vert$$ is less sensitive to large mistakes than MSE, but still quite sensitive to outliers. MAE behaves similarly to MSE when errors are distributed logarithmically (e.g. ratios or price changes).
* Pearson correlation $$Corr(\mathbf{X}, \mathbf{y}) = \frac{Cov(f(X),y)}{\sqrt{var(f(X))var(y)}}$$ and its ordinal transformed variant Spearman correlation are on the scale $$[-1,1]$$. Both correlations can be close to $$1$$ even when $$f(X)$$ is a consistent over/underestimate of $$y$$. Spearman correlation can be close to $$1$$ even when the relationship between $$f(X)$$ and $$y$$ is non-linear. 

These metrics share a common property: an extremely large mistake can be weighted much more harshly than several somewhat large mistakes or many medium mistakes. This is not always a desirable property. Recall our first example of a system that users query for value estimates. It is quite likely that any user who receives an estimate that they perceive as "obviously wrong" will stop using the system. Once a mistake is past this boundary its magnitude becomes irrelevant. A successful system will therefore minimize the number of users who end up in this bucket, rather than weighting some mistakes in this bucket higher than others. We can capture this kind of mistake dynamics with percentile error metrics like P50 and P95.

For example, the P95 error is the smallest value such that for 95% of pairs $$(X, y)$$ the quantity $$ \vert f(X) - y \vert$$ is smaller than this value. The magnitude of the worst 5% of errors has no impact on the P95 error. Similarly, the p50 error (aka the median error) is useful for tracking performance across many samples in the dataset. Any large improvement to the P50 error usually represents improvements on a large number of samples. Contrast this to MSE or correlation which can swing even when the prediction only changes on a single sample.




<!-- 

* A demand forecasting system that a large distributor builds to inform their supply strategy of an item with a very short shelf life. Both consistent small mistakes and infrequent large mistakes will erode the distributor's margin and be equally damaging. 

There are a few metrics that are quite common to use in practice
* The Mean Square Error (MSE) of our model $$f$$ is the average of the squared differences $$(f(X) - y)^2$$ between our model predictions and target values. MSE is very commonly used, probably because of its relationship with the normal distribution. Despite being a darling of statisticians MSE is often not the best metric for real world regression problems. It weighs large mistakes dramatically larger than small ones, and it is quite common for model A to have a better MSE than model B, but to generate worse predictions on 95% of cases. Note that MSE is often reported as [R-Squared](https://danshiebler.com/2017-6-25-metrics)), which is scaled from $$[0,1]$$ and equivalent up to a constant factor determined by the distribution of $$y$$.
* The Mean Absolute Error (MAE) of our model $$f$$ is the average of the absolute values of the differences $$|f(X) - y|$$ between our model predictions and target values. MAE is less sensitive to large mistakes than MSE, but it is still quite sensitive to outlier values. On datasets where errors are distributed logarithmically (quite common when predicting ratios or price changes) MAE behaves very similarly to MSE.
* The Pearson correlation between our model $$f$$ and target quantity $$y$$ tracks the strength of the linear relationship between the model predictions $$f(X)$$ and targets $$y$$. Formally if we define $$A$$ to be a vector of model predictions $$f(X_i)$$  and $$B$$ to be a vector of targets $$y_i$$ then Pearson correlation of $$A,B$$ is $$Corr(A,B) = Cov(A,B)/\sqrt{var(A)var(B)}$$ where $$Cov(A,B)$$ is the empirical covariance of $$A,B$$. Pearson correlation is on the scale $$[-1,1]$$ and it is not scale sensitive: this metric can be close to $$1$$ even $$f(X)$$ is a consistent over/underestimate.
* The Spearman correlation between our model $$f$$ and target quantity $$y$$ tracks the monotonicity of the relationship between the model predictions $$f(X)$$ and targets $$y$$. This metric is the Pearson correlation of the ordinal transformations of $$f(X)$$ and $$y$$, and therefore measures the strength of the linear relationship between the ordered indices of the model predictions and target quantities. Unlike Pearson correlation, Spearman correlation can be close to $$1$$ even when the relationship between $$f(X)$$ and $$y$$ is non-linear

A single large mistake is unlikely


A single massive mistake can bankrupt the distributor, whereas small errors in  


 a very high rating item below a very low rating item. Missing the 


- If our objective is to predict users' affinities for potential recommendations, then a ranking system where we predict the likelihood that a user will like a piece of content


We can only confidently use regression to solve any real world problem if we first choose a metric that captures that problem's core requirements.

However, exhibit  the mapping of mistake type -> impact that arises in 
many real world problems exhibit mistake dynamics most commonly used regression metrics are only


 packages report metrics that are quite nuanced and weight mistakes quites differently from the n

However, this framing can is deceptively complex, and it can ask

Despite this apparent simplicity, regression problems can be quite different based on the core problem 




However, none of these metrics r
 -->