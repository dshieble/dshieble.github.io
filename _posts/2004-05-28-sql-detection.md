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

Let's 



- classification is the problem of grouping objects into one of two buckets
- detection is a subcategory of classification where the objects are events and the buckets are good (common) and bad (rare)
  - fraud and cyberattacks are detection examples
- we can take a datamodel approach to detection. suppose we have a system that processes events and writes them as rows in a table, where columns are our observations about the event
- we can therefore express simple detection algorithms as a SQL query over this table
  - specifically using a SELECT * FROM <TABLE> WHERE <SQL logic that characterizes the algorithm>

- for example, suppose we are a payment processor and we want to identify potentially fraudulent transactions. The rows in our table are transactions, the columns are the information we have about the transactions, and the SQL query is the fraud detection algorithm

- SQL is extremely expressive, and we can use this to build some quite sophisticated decision rules without sacrificing end-to-end interpretability and editability

- For example, we can build any decision trees in SQL
  `(colA > thresh A AND colB > thresh B) OR (colA <= threshA AND colC > thresh C)`

<diagram of decision tree>

- Or we can express any linear decision classifier over columns with a condition like
  `(coeffA * colA + coeffB * colB > thresh`

- One of the major benefits of SQL is its universal understandability, and domain experts who are not otherwise great programmers can be easily taught to understand and edit it, but execution is simple enough to prevent footguns

- in the real world we might have multiple "detection algorithms" that are deployed side-by-side. We can visualize this as separate SQL WHERE statements that are connected by an OR into the overall algorithm
  - specifically using a SELECT * FROM <TABLE> WHERE <logic for first algorithm> OR <logic for second algorithm> OR ...
- this structure supports independent development of different algorithms by different analysts


# Constructing Rules

One of the key challenges in writing detection rules is that we are unlikely to have labels for previously undetected safe samples. Labeling an event likely requires domain expertise, and in many domains the rule writer and labeler are the same person

- There is a simple human-in-the-loop algorithm that analysts can follow to write a good detection algorithm in SQL
  - Come up with a theory for a broad heuristic that will spot a bunch of bad stuff
  - Implement this heuristic in SQL and run the query
  - Look at the results and label a sample of them as "good" or "bad". This might involve pulling in additional information that isn't present in the event table, such as whether a chargeback was later issued or a fraud report was later opened
  - Identify if there are additional predicates that will stop some of the good stuff from getting picked up without stopping the bad stuff from getting picked up
  - Add these predicates to the query and repeat

- This is often automatable with LLMs! There are two steps that require an LLM
  - Label a row as "good" or "bad"
  - Given a description of the table, a query, a sample of good rows fetched by that query and a sample of bad rows fetched by that query, modify the query so that all bad rows remain detected and as many good rows as possible are filtered out

Converting an LLM into a labeler requires distilling down human insight 
<example prompt and results>

One of the key assumptions in this flow is that the rule writer (either the analyst or the LLM) has access to ground truth

  - A 
  - Some way to distinguish good stuff and bad stuff from the results. If the data is labeled this is as simple as joining in the label table. If not then we'll ask the LLM to "eyeball" the results by looking at the full row of data
  -



- A corollary of this



<!-- http://maltzj.com/posts/rules-engines -->