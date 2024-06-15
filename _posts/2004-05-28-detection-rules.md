---
layout: post
title: Generating Detection Rules with LLMs
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

This problem - identify a small number of bad events in a sea of good events - is known as detection. This shows up in many domains: fraudulent payments, phishing emails, illegal social media posts, etc.

Detection is a subcategory of classification, so one approach to solve a detection problem is to extract a bunch of features from events and throw a ML model trained on "bad" vs "good" at the problem. This is tough in practice. Interpretability tends to be paramount (people want to know why their payment was bounced), labels can be expensive to acquire and balance (especially since good events can be extremely diverse and many orders of magnitude more common than bad events), and the core problem is adversarial (malicious actors change up their techniques whenever they stop working).

For these reasons most organizations operating a detection engine use rules as a detection baseline. An example payment fraud detection rule might be:
```
(
  address_verification_fails = true
  AND previous_fraud_count > 0
) OR (
  cvc_verification_fails = true
)
```
Organizations generally express these kinds of rules through a rule engine like [Stripe Radar](https://docs.stripe.com/radar/rules). These kinds of rules have a lower performance ceiling than an end-to-end ML model, but their interpretability and editability make them useful baselines. 

There is a simple human-in-the-loop algorithm that analysts can follow to write good detection rules
* Come up with a theory for a broad heuristic that will spot a bunch of bad stuff
* Implement this heuristic in the rule engine and run the query
* Label the samples that the rule flagged as "good" or "bad"
* Identify if there are additional predicates that will stop some of the good stuff from getting picked up without stopping the bad stuff from getting picked up
* Add these predicates to the query and repeat

![Rule writing feedback loop](/img/rule_writing_feedback_loop.png)


This human-in-the-loop algorithm doesn't look too different from an ML model training algorithm - the rule evolves in an iterative fashion as human provided labels identify incorrect judgements. This raises the question - can we automate this process by replacing the human-in-the-loop components with LLMs?

Breaking this down, we need to replace human judgements with LLM judgements in two tasks:
* *Task 1*: Given a sample that the rule flagged, label it as "good" or "bad"
* *Task 2*: Given a description of the table, a query, a sample of good rows fetched by that query and a sample of bad rows fetched by that query, modify the query so that all bad rows remain detected and as many good rows as possible are filtered out.

One simple way to solve Task 1 is to use a prompt like the following:
> You are a fraud detection agent reviewing payments for evidence of fraud.  
Here are detailed instructions on how you spot fraud in a payment:  
...  
Here are some examples of previous fraudulent payments:  
...  
Here are some examples of previous legitimate payments:  
...  
Please inspect the following payment:  
...  
Is this payment fraudulent?

The performance of this prompt will likely by bottlenecked by how well the payment is described to the model. Any information about the payment that a human labeler might use to judge whether the payment is bad should be included in the prompt. More complex solutions to Task 1 might involve finetuning the LLM on labeled data or breaking the problem into subproblems handled by separate agents. 

That said, while a better LLM labeling agent will improve the final rule, in high noise domains the resulting algorithm may actually have higher accuracy than the LLM labeling agent itself. Forcing the algorithm to be expressed as a simple rule (rather than the black magic voodoo going on inside of the LLM) enables [Occam's Razor](https://en.wikipedia.org/wiki/Occam%27s_razor) to work its magic. 


We can solve Task 2 by writing a prompt like the following alongside a parser to pipe the output back into the rule engine:
> You are a fraud detection agent writing a fraud detection rule.  
Here is the set of all signals that are available in your rule writing engine:  
...  
Here is the syntax of your rule writing engine:  
...  
Here is the rule you have written so far:  
...  
You can edit this rule by generating an output in the following format:  
...  
This rule correctly flags the following fraudulent payments:  
...  
This rule incorrectly flags the following legitimate payments:  
...  
Please edit this rule to continue flagging these fraudulent payments and no longer flag these legitimate payments.


This approach can substantially cut down on the human effort required to operate a rule-based detection engine without sacrificing the simplicity, interpretability and editability of the detection logic.




 <!-- This approach also requires little to no human labeled data - unlike a more sophisticated end-to-end machine learning algorithm.  -->

<!-- This approach has a number of desirable advantages. While this is unlikely to outperform an end-to-end machine learning algorithm trained on piles of human labeled data, this approach requires very little . However, -->
<!-- Ultimately this approach is most appropriate when we can construct a good LLM labeling agent, but need to deploy a rule that is interpretable and efficient. 



Stepping back, there are many ways to solve a detection problem. End-to-end machine learning is effective, but lacks interpretability and can degrade quickly in an adversarially evolving landscape. Rule based systems can  powerful features like `previous_fraud_count > 0` are available  -->



<!-- There are many ways to solve a detection problem. End-to-end machine learning approaches are generally the most effective approaches, but they often lack interpretability and degrade quickly in an adversarially evolving landscape. The SQL-based detection method yields simple and interpretable results. These results can be improved iteratively - bolstering system integrity and reliability. This approach is a strong choice for high noise detection problems. -->


<!-- Like ML models, rule engines require data to be effective. The rule implementation process generally looks something like
* Come up with an idea for a rule
* Implement the rule in the rule engine
* Backtest the rule against logs
* Take a look at what the rule flagged, edit it if necessary, and repeat -->
<!-- 
The benefit of rule engines is that the final model 


For the purpose of this post

Like models, these

- heuristics are effective and interpretable
- rule engines for expressing heuristics are critical - generally this 
- evaluation infrastructure is critical
- dead simple way to express heuristics and heuristic evaluation is a single big table with a column for every signal and the heuristic in the WHERE statement
- this formulation shows a 

- talk about heuristic  -->

<!-- The key to generating good rules is good labels. A key challenge in writing detection rules is acquiring these labels at scale. This is not difficult for a small set of samples. If we pull in additional information that wasn't present at event processing time but is possible to acquire now - such as whether a chargeback was later issued or a fraud report was later opened - we can consolidate this information into an event report. A human reviewer (or perhaps an LLM) can review this report to issue a judgement. -->


<!-- 
- classification is the problem of grouping objects into one of two buckets
- detection is a subcategory of classification where the objects are events and the buckets are good (common) and bad (rare)
  - fraud and cyberattacks are detection examples -->
<!-- 
In this post we'll explore a dead simple approach to building interpretable detection algorithms by hand and with AI. 

## SQL-Based Detection 

Suppose we have a system that processes events and writes them as rows in a table, where the columns in the table are the signals or observations associated with each event. We can therefore express simple detection algorithms as a SQL WHERE block like:
```SELECT * FROM <TABLE> WHERE <SQL logic that characterizes the algorithm>```

In our payment processor example each row will be a transaction, columns might be signals like the dollar value of the transaction, the fraud history of the payer, the address verification status, the payer zip code, etc. An example algorithm expressed in SQL might be something like:
```(address_verification_fails = true AND previous_fraud_count > 0) OR (cvc_verification_fails = true)```

SQL is extremely expressive, and we can use this to build some quite sophisticated decision rules without sacrificing end-to-end interpretability and editability. For example, we can express any decision tree in SQL with logic like:
```(colA > thresh A AND colB > thresh B) OR (colA <= threshA AND colC > thresh C)```

<diagram of decision tree>

And we can express any linear decision classifier in SQL with logic like:
```(coeffA * colA + coeffB * colB) > thresh```

SQL's simplicity and universality are major advantages - many domain experts - and all good LLMs - know the syntax, and execution is simple enough to prevent footguns. 

SQL is also nicely decomposable. Teams can develop detection algorithms independently and run them side-by-side connected by SQL OR statements in the WHERE block. Specifically this looks like:
```SELECT * FROM <TABLE> WHERE (<logic for first algorithm> OR <logic for second algorithm> OR ...)```

This makes it much easier to scale teams through decomposition.

<diagram of independent detection algorithm developements> -->


<!-- ## Constructing Rules** -->
<!-- One of the key challenges in writing detection rules is that we are unlikely to have labels for previously undetected safe samples. Labeling an event likely requires domain expertise, and in many domains the rule writer and labeler are the same person. -->



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


















<!-- 
 -->



<!-- 







Suppose you are a payment processor handling thousands or millions of payments every day. Some small number of the payments that you process are bound to be fraudulent. How can you spot them?

This problem - identify a small number of bad events in a sea of good events - is known as detection. This shows up in many domains outside of fraud
* Identify fraud events among safe events
* Identify phishing emails among safe emails
* Identify abusive or illegal posts among safe posts on a social media platform
* etc

Detection is a subcategory of classification, so one approach to solve detection problems is to extract a bunch of features from events and throw a ML model trained on "bad" vs "good" at the problem. 

This is to be tough in practice. Interpretability tends to be paramount (people want to know why their payment was bounced), labels can be expensive to acquire and balance (especially since good events can be extremely diverse and many orders of magnitude more common than bad events), and the core problem is adversarial (malicious actors change up their techniques whenever they stop working) and 








<!-- 


In this post we'll explore a dead simple approach to building interpretable detection algorithms by hand and with AI. 

## SQL-Based Detection 

Suppose we have a system that processes events and writes them as rows in a table, where the columns in the table are the signals or observations associated with each event. We can therefore express simple detection algorithms as a SQL WHERE block like:
```SELECT * FROM <TABLE> WHERE <SQL logic that characterizes the algorithm>```

In our payment processor example each row will be a transaction, columns might be signals like the dollar value of the transaction, the fraud history of the payer, the address verification status, the payer zip code, etc. An example algorithm expressed in SQL might be something like:
```(address_verification_fails = true AND previous_fraud_count > 0) OR (cvc_verification_fails = true)```

SQL is extremely expressive, and we can use this to build some quite sophisticated decision rules without sacrificing end-to-end interpretability and editability. For example, we can express any decision tree in SQL with logic like:
```(colA > thresh A AND colB > thresh B) OR (colA <= threshA AND colC > thresh C)```

<diagram of decision tree>

And we can express any linear decision classifier in SQL with logic like:
```(coeffA * colA + coeffB * colB) > thresh```

SQL's simplicity and universality are major advantages - many domain experts - and all good LLMs - know the syntax, and execution is simple enough to prevent footguns. 

SQL is also nicely decomposable. Teams can develop detection algorithms independently and run them side-by-side connected by SQL OR statements in the WHERE block. Specifically this looks like:
```SELECT * FROM <TABLE> WHERE (<logic for first algorithm> OR <logic for second algorithm> OR ...)```

This makes it much easier to scale teams through decomposition.

<diagram of independent detection algorithm developements>


## Constructing Rules

 
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











http://maltzj.com/posts/rules-engines --> 