---
layout: post
title: Rule Engine
tags: [Classification, Machine Learning, Artificial Intelligence]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

Suppose you are a payment processor handling thousands or millions of payments every day. Some small number of the payments that you process are bound to be fraudulent. How can you spot them?

This problem - identify a small number of bad events in a sea of good events - is known as detection. This shows up in many domains outside of fraud
* Identify fraud events among safe events
* Identify phishing emails among safe emails
* Identify abusive or illegal posts among safe posts on a social media platform
* etc

Detection is a subcategory of classification, so one approach to solve detection problems is to extract a bunch of features from events and throw a ML model trained on "bad" vs "good" at the problem. 

This is to be tough in practice. Interpretability tends to be paramount (people want to know why their payment was bounced), labels can be expensive to acquire and balance (especially since good events can be extremely diverse and many orders of magnitude more common than bad events), and the core problem is adversarial (malicious actors change up their techniques whenever they stop working) and 

<!-- 
- classification is the problem of grouping objects into one of two buckets
- detection is a subcategory of classification where the objects are events and the buckets are good (common) and bad (rare)
  - fraud and cyberattacks are detection examples -->

In this post we'll explore a dead simple approach to building interpretable detection algorithms by hand and with AI. 

## SQL-Based Detection 

Suppose we have a system that processes events and writes them as rows in a table, where the columns in the table are the signals or observations associated with each event. We can therefore express simple detection algorithms as a SQL WHERE block like:
`SELECT * FROM <TABLE> WHERE <SQL logic that characterizes the algorithm>`

In our payment processor example each row will be a transaction, columns might be signals like the dollar value of the transaction, the fraud history of the payer, the address verification status, the payer zip code, etc. An example algorithm expressed in SQL might be something like:
`(address_verification_fails = true AND previous_fraud_count > 0) OR (cvc_verification_fails = true)`

SQL is extremely expressive, and we can use this to build some quite sophisticated decision rules without sacrificing end-to-end interpretability and editability. For example, we can express any decision tree in SQL with logic like:
`(colA > thresh A AND colB > thresh B) OR (colA <= threshA AND colC > thresh C)`

<diagram of decision tree>

And we can express any linear decision classifier in SQL with logic like:
`(coeffA * colA + coeffB * colB) > thresh`

SQL's simplicity and universality are major advantages - many domain experts - and all good LLMs - know the syntax, and execution is simple enough to prevent footguns. 

SQL is also nicely decomposable. Teams can develop detection algorithms independently and run them side-by-side connected by SQL OR statements in the WHERE block. Specifically this looks like:
`SELECT * FROM <TABLE> WHERE (<logic for first algorithm> OR <logic for second algorithm> OR ...)`

This makes it much easier to scale teams through decomposition.

<diagram of independent detection algorithm developements>


## Constructing Rules

<!-- One of the key challenges in writing detection rules is that we are unlikely to have labels for previously undetected safe samples. Labeling an event likely requires domain expertise, and in many domains the rule writer and labeler are the same person. -->

 
The key to generating good rules is good labels. A key challenge in writing detection rules is acquiring these labels at scale. This is not difficult for a small set of samples. If we pull in additional information that wasn't present at event processing time but is possible to acquire now - such as whether a chargeback was later issued or a fraud report was later opened - we can consolidate this information into an event report. A human reviewer (or perhaps an LLM) can review this report to issue a judgement.

There is a simple human-in-the-loop algorithm that analysts can follow to write a good detection algorithm in SQL
* Come up with a theory for a broad heuristic that will spot a bunch of bad stuff
* Implement this heuristic in SQL and run the query
* Generate event reports a sample of the results and label them as "good" or "bad"
* Identify if there are additional predicates that will stop some of the good stuff from getting picked up without stopping the bad stuff from getting picked up
* Add these predicates to the query and repeat


#### Rule Automation

We can fully automate this algorithm by building LLM agents to accomplish the following tasks:
1. Given an event report, label it as "good" or "bad"
2. Given a description of the table, a query, a sample of good rows fetched by that query and a sample of bad rows fetched by that query, modify the query so that all bad rows remain detected and as many good rows as possible are filtered out

A prompt for task 1 might look like
<example prompt and results>

And a prompt for task 2 might look like
<example prompt and results>

A better task 1 LLM labeling agent will generally improve the final SQL rule. However, in high noise domains with high human mislabel rates the resulting algorithm may actually have higher accuracy than the LLM labeling agent itself. Forcing the algorithm to be expressed in SQL enables [Occam's Razor](https://en.wikipedia.org/wiki/Occam%27s_razor) to work its magic. 


## Conclusion

There are many ways to solve a detection problem. End-to-end machine learning approaches are generally the most effective approaches, but they often lack interpretability and degrade quickly in an adversarially evolving landscape. The SQL-based detection method yields simple and interpretable results. These results can be improved iteratively - bolstering system integrity and reliability. This approach is a strong choice for high noise detection problems.



<!-- 


One of the key assumptions in this flow is that the rule writer (either the analyst or the LLM) has access to ground truth

  - A 
  - Some way to distinguish good stuff and bad stuff from the results. If the data is labeled this is as simple as joining in the label table. If not then we'll ask the LLM to "eyeball" the results by looking at the full row of data
  -
 -->


<!-- 








- This is often automatable with LLMs! There are two steps that require an LLM
  - Label a row as "good" or "bad"
  - Given a description of the table, a query, a sample of good rows fetched by that query and a sample of bad rows fetched by that query, modify the query so that all bad rows remain detected and as many good rows as possible are filtered out -->




<!-- http://maltzj.com/posts/rules-engines -->