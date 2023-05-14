---
layout: post
title: Using Large Language Models (Part 2 - LLM Design Patterns)
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


> This post is part two in a two part series on how to use LLMs in a software system. Find part one [here](https://danshiebler.com/2023-05-12-large-language-models-part-1) 

Powerful. Costly. Capricious. Software that uses LLMs requires specialized design patterns to emphasize their strengths and minimize their weaknesses. In this post we will explore a few illustrative examples.

## Agents

Let's say you want to use a Q/A system that allows an LLM to respond to queries like "what has the president of the United States done in the last month?". Any LLM trained more than a month ago will not have this information stored in its weights, so we need to get this information from somewhere else: perhaps a news article or web search API. There are a number of ways we can design the interface between the LLM and this API.

At one end of the spectrum is to do everything by hand: write the relevant queries to the search API, append the result to the original question, and use the composite text as the LLM prompt.

![One pass](/img/LLMOnePass.png)

On the other end of the spectrum is an end-to-end LLM-powered agent that autonomously identifies the queries it needs from the original prompt, passes these queries to the search APIs, passes the results back to the LLM, and repeats this process until the LLM produces a final answer. This strategy requires a module to parse the LLM response into either a search query or a final result.

![End to end agent](/img/LLMEndtoEndAgent.png)

Between these extremes is a hybrid approach in which we first prompt the LLM to construct a query that will find the information it needs to complete the summary, manually run the query, and pass the query results back to an LLM in another prompt that asks it to write the summary. 

![Hybrid](/img/LLMHybrid.png)

This spectrum captures the degree to which the software system cedes ownership of the control flow to the LLM. Ceding more control to the LLM can allow the system to exhibit advanced behavior.

![Three options for LLMs](/img/LLMsTextSketch-Agents.drawio.png)

The One Pass LLM relies entirely on human input to structure the information that the LLM uses. The hybrid approach gives the LLM control over one search query but does not enable the LLM to request additional information. The End-to-End Agent system can sequentially issue multiple search queries of increasing refinement as it sees and interprets the results of earlier search queries. 

Choosing a spot on this spectrum requires a number of considerations. For example, the One Pass LLM is probably sufficient to support different queries over the same corpus of data. If we expect each query to require different underlying data then giving the LLM control over the query logic can reduce the complexity required.
- **LLM Power** Systems like the End-to-End Agent ask the LLM to remember context across multiple executions and balance multiple input and output formats. Less powerful (cheaper) LLMs can struggle to do this effectively.  


Similarly, more

- How different do we expect the optimal search patterns to be?
- How much do we trust the LLM to avoid getting stuck in loops?
- How complex is the search API?


## Context Windows


Context window management



Option is to use an LLM agent to solve the problem end-to-end. 



Costs
Tool expectations
Implicit Agents vs Explicit Agents
	- how much logic to offload to the model?
Balancing


## Context Windows



## Conclusion








<!-- One of the first things that jumps out when using large language models to solve problems is how many design decisions we need to make. 
 -->
<!-- One component that distinguishes the End-to-End Agent architecture from the other two architectures is the LLM Output Manager. In this architecture the LLM output itself controls whether the software system simply returns the output or makes a call to the search API and then re-runs the LLM.
 -->
 



