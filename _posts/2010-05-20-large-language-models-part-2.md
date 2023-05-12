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

Let's say you want to use an LLM to summarize everything that the president of the United States has done in the last month. There are a number of big decisions we need to make when designing this system.

First, where is the raw information going to come from? Any LLM trained more than a month ago will not have this information stored in its weights. A google search may be sufficient, but there may be news APIs that would surface higher quality information. 

Next, how will we extract the raw information from these sources? Our strategy here lies on a spectrum. At one end is to do everything by hand: manually construct queries to the search or news APIs and manually pass these results back to the LLM.

On the other end of the spectrum is to use an LLM-powered agent that autonomously identifies the queries it needs from the "write a summary..." 

 construct the API query and passes the results back into the LLM before generating the final result. 

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













