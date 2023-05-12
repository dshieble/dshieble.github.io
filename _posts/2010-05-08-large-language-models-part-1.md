---
layout: post
title: Using Large Language Models (Part 1 - Text Representations)
tags: [Machine Learning, Machine Learning Systems, ML, Large Language Models, GPT]
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

Generative large language models (LLMs) like ChatGPT have changed the game. Previously impossible problems are now solvable without substantial time investment or labeled data. This has tremendous implications for the future of software develoment, data science, and machine learning engineering.

LLMs have unique interfaces and limitations which shape the software ecosystems around them. In this series we explore how to make optimal use of these models as components of a software system.


## Text - The New Lingua Franca

In order to understand a system we need to study how it represents information. Computers represent raw data in a binary form, and computer operations pass through this format while transforming data. For example, computing with real numbers requires transforming the numbers to binary (perhaps via floating point), performing the computation, and then reinterpreting the binary result as real numbers.

LLMs represent information through text. Their world model is derived from the entities and relationships present in their text training corpus. Their weights may be numerical, but our primary portal to access the representations these weights encode is text.

In general, LLMs consume text as input and produce text as output. A software system that uses LLMs in the decision making chain will need to cleverly transform data to text and transform LLM text output to program instructions.

![We transform data to and from text when working with LLMs](/img/LLMsText.drawio.png)

Let's say we want to classify transactions as fraudulent or safe using signals like purchase history, product metadata, transaction context, etc. We need to present these signals differently depending on who or what is doing the classification:
- **Human**: A human classifying a transaction would need some mechanism to access this data when they make their decision. The human's portal to the data might include text, numbers, graphs, etc. If the human has not received specialized training then this portal must be as self-explanatory as possible.
- **Traditional ML**: An ML model would consume this data as a single vector of engineered features. This vector does not need to be self-explanatory: we expect an ML model to learn how to interpret its input features during training.
- **LLMs**: An LLM would consume the data as text. We can think of this text representation as a domain transformation of the data from its native format to the text format that the LLM was pretrained on. The text representation should be interpretable without outside context.

Humans and LLMs have world models that enable them to model the behaviors of certain kinds of data without additional context. In the case of LLMs this world model is formed by scanning enormous amounts of text data. Human-friendly and LLM-friendly representations of data present information in ways that are aligned with these world models. In contrast, the traditional ML-friendly representation does not attempt to benefit from any familiarity with other representations of data. 


### Tabular Data
Most software systems represent data in a tabular format. We should therefore take a moment to describe how we could represent tabular data to an LLM.

Let's go back to the fraud detection example. Our data model of a particular transaction might be distributed across multiple tables:
- **Transaction**: user id, product id, seller id, transaction timestamp, transaction location, payment method, user IP, etc
- **User**: name, location, list of recent purchases, etc
- **Product**: product type, product description, list of recent sales, etc
- **Seller**: location, fraud history, list of other products sold, etc


Given a single transaction we would go through the following steps to derive the relevant signals. First, we query the Transaction table to get the Transaction row. Next, we extract the user id, product id, seller id from this row and use these to query the User, Product, and Seller tables. We then concatenate these four rows together into a single row of raw features. Finally, we use the data in this row to engineer some additional features: such as whether this user has previously bought from this seller.

The simplest textual representation of these features would then be a comma-separated concatenation of the four rows and the additional engineered features. This kind of context-free representation would work fine for a traditional ML model, which will learn the significance of each signal during training. 

We do not have this luxury when using a zero shot LLM (or a human labeler). The significance of each signal must be self-evident from the way that it is presented in the text. For example, we could write a brief description of each column and each derived feature and represent the data in a format like:
```
<description 1>: <value 1>
<description 2>: <value 2>
...
<description N>: <value N>
```


### Numbers

Large language models are notoriously bad at understanding very large or very small numbers. This is due to limitations in their training data and architecture. Most LLM training data does not have a very high density of large number arithemetic, and deep neural networks may propagate errors in large scale symbolic arithmetic.

As a result we need to be cautious when passing numerical features to LLMs. For example, although we might expect certain types of traditional machine learning models (like deep neural networks) to recognize that the ratio of two features is predictive, an LLM may struggle to draw this conclusion.

We can solve this problem by connecting an LLM-powered agent to a calculator (like ChatGPT's wolfram alpha plugin). However, this can add a substantial amount of complexity.

Another way around this problem is to replace raw numbers or computed values with descriptive text like small/medium/large or comparative figures like "twice as large as the median value". 

## Conclusion

Humans understand language. We produce a lot of it, about a lot of different things, in a lot of different ways. We use language to understand and communicate with the world around us.

LLMs tap into the text data that we leave behind to form a world model that mimics ours. This text data contains artifacts of human reasoning. By transforming a problem to a text representation LLMs can parrot this reasoning - even without labeled training examples. This is a completely different way of solving problems than the strategy employed by traditional ML models, and can be superior when we only have a small amount of data or very noisy labels.

In the next post we will explore some different paradigms for using and optimizing LLMs.

















<!-- For simplicity let's assume that the historical transactions associated with a user/product/seller are already adequately summarized in the user/product/seller tables. In this case  -->


<!-- > Yes, LLMs are capable of consuming and producing image and sound. But text remains the bridge between these media. -->

<!-- There are many problems in which we only have <!-- a small amount of data or very noisy labels. --> In these cases LLMs  -->


 <!-- there may be a large gap between the performance of a trained human labeler and a traditional ML model. In these cases transforming the data to text and passing it to an LLM may be the most powerful strategy. -->




<!-- The field of prompt engineering has sprung up around the careful construction of text commands that elicit desired behavior from LLMs. -->


<!-- There are many different kinds of prompt engineering, but one of the most interesting is what we might call the "ML translation". Given an ML problem with a set of well engineering features -->


<!-- One of the most striking things when working with LLMs is the realization that their primitive understanding of the world is text.

They consume this text as 


The float representation enables computer systems to use this binary representation to operate on real numbers.


Computers understand data in terms 
 -->






