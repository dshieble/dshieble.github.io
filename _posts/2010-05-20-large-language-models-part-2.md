---
layout: post
title: Using Large Language Models (Part 2 - Paradigms)
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


> This post is part two in a two part series on how to use LLMs in a software system. Find part one [here](https://danshiebler.com/2023-05-08-large-language-models-part-1) 

## Introduction

Generative large language models (LLMs) like ChatGPT have changed the game. Previously impossible problems are now solvable without substantial time investment or labeled data. This has tremendous implications for the future of software develoment, data science, and machine learning engineering.

LLMs have unique interfaces and limitations which shape the software ecosystems around them. In this series we explore how to make optimal use of these models as components of a software system.

When arge language model requires

LLMs are costly and capricious, but extremely powerful. 

## Paradigms

<!-- One of the first things that jumps out when using large language models to solve problems is how many design decisions we need to make. 
 -->

Let's say you want to use a Q/A system that allows an LLM to respond to queries like "what has the president of the United States done in the last month?". Any LLM trained more than a month ago will not have this information stored in its weights, so we need to incorporate a search API. There are a number of ways we can design the interface between the LLM and this API.

At one end of the spectrum is to do everything by hand: write the relevant queries to the search API and write an LLM prompt that includes these results appended to the original question.

On the other end of the spectrum is an end-to-end LLM-powered agent that autonomously identifies the queries it needs from the "write a summary..." prompt, passes these queries to the search APIs, and then passes the results back to the LLM. This strategy requires an LLM Output Manager that interprets the results of the LLM execution to decide whether to treat the output as a query and re-run the chain, or to return the LLM output as the final result.

Between these extremes is a hybrid approach in which we first manually prompt the LLM to construct a query that will find the information it needs to complete the summary, manually run the query, and pass the query results back to an LLM in another prompt that asks it to write the summary.

![Three options for LLMs](/img/LLMsTextSketch-Agents.drawio.png)


In this case we don't need an LLM Output Manager, since the software system that


 prompts from the initial "write a summary..." prompt: first one that instructs the LLM to

We can see all three of these options in the following graphic




 Another option is to build an autonomous LLM-powered agent that can construct the API query and passes the results back into the LLM before generating the final result. 

Finally, how will we present this raw information to the LLM

You can't just prompt ChatGPT with this: this is not information that ChatGPT has stored in its weights. We need to provide this information to the LLM in one way or another.

- Where does the raw information come from? 
- How do we source the raw information
- How do we present this information to the LLM?
- 



Option is to use an LLM agent to solve the problem end-to-end. 



Costs
Context window management
Tool expectations
Implicit Agents vs Explicit Agents
	- how much logic to offload to the model?
Balancing


## Context Windows



## Conclusion













