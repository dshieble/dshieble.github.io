---
layout: post
title: Beyond Natural Language - Using LLMs to Solve your Problems
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


Generative large language models (LLMs) like ChatGPT have changed the game. Previously impossible problems are now solvable without substantial time investment or labeled data. This has tremendous implications for the future of software develoment, data science, and machine learning engineering.

LLMs have unique interfaces and limitations which shape the software ecosystems around them. In this series we explore how to make optimal use of these models as components of a software system.

Throughout this post we will anchor to a motivating example: fraud detection. Payment processing systems need to identify which transactions are fraudulent. To do this they evaluate the contextual information surrounding each transaction.
<!-- 
 Solving fraud detection with LLMs 

Fraud detection is not inherently a natural language problem, but in this post we will demonstrate we can apply LLMs to solve it.  
 -->

## What is a Generative Large Language Model?

A generative large language models (LLM) is an massive neural network model that accepts a string of text and returns a logical continuation or completion of that text.

The most powerful and useful modern generative large language models, like ChatGPT, are optimized to follow instructions. This allows them to return structured strings (like json) that other software systems can consume. 

For example, such a model could accept a string like:
```
Convert the following text to iambic pentameter.

Jersey Shore is an American reality television series that ran on MTV from December 3, 2009, to December 20, 2012. The series follows the lives of eight housemates at a vacation home in Seaside Heights, New Jersey, on the Jersey Shore in seasons one, three, five, and six; South Beach, Florida, in season two; and Florence, Italy, in season four.

Format your output in json as:
{
	original: <the input text>,
	iambic: <the iambic pentameter text>
}
```
and output the string:
```
{
"original": "Jersey Shore is an American reality television series that ran on MTV from December 3, 2009, to December 20, 2012. The series follows the lives of eight housemates at a vacation home in Seaside Heights, New Jersey, on the Jersey Shore in seasons one, three, five, and six; South Beach, Florida, in season two; and Florence, Italy, in season four.",
"iambic": "Jersey Shore, an American TV show's run,\nFrom 2009 to 2012, on MTV,\nThe lives of eight housemates, one by one,\nAt a beach house, they lived most happily.\nSeaside Heights, New Jersey, seasons prime,\nOne, three, five, and six, their joy did thrive,\nSouth Beach, Florida, in season two's time,\nAnd Florence, Italy, for season four's drive."
}
```


## Text - The New Lingua Franca

In order to understand a system we need to study how it represents information. Computers represent raw data in a binary form, and computer operations pass through this format while transforming data. For example, computing with real numbers requires transforming the numbers to binary (perhaps via floating point), performing the computation, and then reinterpreting the binary result as real numbers.

LLMs represent information through text. Their world model is derived from the entities and relationships present in their text training corpus. Their weights may be numerical, but our primary portal to access the representations these weights encode is text.

In general, LLMs consume text as input and produce text as output. A software system that uses LLMs in the decision making chain will need to cleverly transform data to text and transform LLM text output to program instructions.

![We transform data to and from text when working with LLMs](/img/LLMsTextSketch.drawio.png)

Let's say we want to classify transactions as fraudulent or safe using signals like purchase history, product metadata, transaction context, etc. We need to present these signals differently depending on who or what is doing the classification:
- **Human**: A human classifying a transaction would need some mechanism to access this data when they make their decision. The human's portal to the data might include text, numbers, graphs, etc. If the human has not received specialized training then this portal must be as self-explanatory as possible.
- **Traditional ML**: An ML model would consume this data as a single vector of engineered features. This vector does not need to be self-explanatory: we expect an ML model to learn how to interpret its input features during training.
- **LLMs**: An LLM would consume the data as text. We can think of this text representation as a domain transformation of the data from its native format to the text format that the LLM was pretrained on. The text representation should be interpretable without outside context.

Humans and LLMs have world models that enable them to model the behaviors of certain kinds of data without additional context. In the case of LLMs this world model is formed by scanning enormous amounts of text data. Human-friendly and LLM-friendly representations of data present information in ways that are aligned with these world models. In contrast, the traditional ML-friendly representation does not attempt to benefit from any familiarity with other representations of data. 


### Tabular Data
Most software systems represent data in a tabular format. We should therefore take a moment to describe how we could represent tabular data to an LLM.

In the fraud detection example our data model of a particular transaction might be distributed across multiple tables:
- **Transaction**: user id, product id, seller id, transaction timestamp, transaction location, payment method, user IP, etc
- **User**: name, location, list of recent purchases, etc
- **Product**: product type, product description, list of recent sales, etc
- **Seller**: location, fraud history, list of other products sold, etc


Given a single transaction we would go through the following steps to derive the relevant signals. First, we query the Transaction table to get the Transaction row. Next, we extract the user id, product id, and seller id from this row and use these to query the User, Product, and Seller tables. We then concatenate these four rows together into a single row of raw features. Finally, we use the data in this row to engineer additional features like "has this user bought from this seller before?"

The simplest text representation of these features is a comma-separated concatenation of the four rows and the additional engineered features. This kind of context-free representation would work fine for a traditional ML model, which will learn the significance of each signal during training. 

We do not have this luxury when using a zero shot LLM (or a human labeler). The significance of each signal must be self-evident from the way that it is presented in the text. For example, we could write a brief description of each column and each derived feature and represent the data in a format like:
```
<description 1>: <value 1>
<description 2>: <value 2>
...
<description N>: <value N>
```

For example, suppose we pass the following prompt to ChatGPT:
```
You are a fraud expert evaluating whether the following transaction data is fraudulent. Please encode your response as json in the following format
{
	judgement: <either FRAUD or SAFE>,
	reasoning: <a 10-20 word description of why you made this judgement>
}
---- BEGIN TRANSACTION DATA ----
What is the product type?: Luxury Goods
When was this user's account created?: 5 minutes before the transaction
How many purchases has this user made?: 10
How many purchases in this product type has this user made?: 10
Is this user using a VPN?: Yes
---- END TRANSACTION DATA ----
```
ChatGPT's response is
```
{
"judgement": "FRAUD",
"reasoning": "High-risk indicators: new account, high number of purchases in a short time, VPN usage."
}
```

### Numbers

Large language models are notoriously bad at understanding very large or very small numbers. This is due to limitations in their training data and architecture. Most LLMs do not see much large number arithmetic in their training data, and deep neural networks may propagate errors in large scale symbolic computations.

As a result we need to be cautious when passing numerical features to LLMs. For example, although we might expect a traditional deep neural network to recognize that the ratio of two features is predictive, an LLM may struggle to draw this conclusion.

We can mitigate this by connecting an LLM-powered agent to a calculator (like ChatGPT's WolframAlpha plugin). However, this adds a substantial amount of complexity.

Another way around this problem is to replace raw numbers or computed values with descriptive text like small/medium/large or comparative figures like "twice as large as the median value". This can work well, but is quite time intensive to design for a large number of features.


## Conclusion

Humans understand language. We produce a lot of it, about a lot of different things, in a lot of different ways. We use language to understand and communicate with the world around us.

LLMs tap into the text data that we leave behind to form a world model that mimics ours. This text data contains artifacts of human reasoning. By transforming a problem to a text representation LLMs can parrot this reasoning - even without labeled training examples. This is a completely different way of solving problems than the strategy employed by traditional ML models, and can be superior when we only have a small amount of data or very noisy labels.

In the next post we will explore some different paradigms for using and optimizing LLMs.


