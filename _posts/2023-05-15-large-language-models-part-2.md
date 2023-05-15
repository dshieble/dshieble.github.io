---
layout: post
title: Design Patterns for LLM-Powered Software
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

Powerful. Costly. Capricious. LLM-powered software must be carefully designed to emphasize their strengths and minimize their weaknesses. In this post we will explore a few LLM design patterns.

## Agents

Let's say you want to build an LLM-powered question/answer system that supports queries like "what has the president of the United States done in the last month?". Any LLM trained more than a month ago will not have this information stored in its weights, so we need to get this information from somewhere else: perhaps a news article or web search API. There are a number of ways we can design the interface between the LLM and this API.

At one end of the spectrum is to do everything by hand: write the relevant queries to the search API, append the result to the original question, use the composite text as the LLM prompt, and execute the LLM in one pass.

![One pass](/img/LLMOnePass.png)

On the other end of the spectrum is an end-to-end LLM-powered agent that autonomously identifies the queries it needs from the original prompt, passes these queries to the search APIs, passes the results back to the LLM, and repeats this process until the LLM produces a final answer. This strategy requires a module to parse the LLM response into either a search query or a final result.

![End to end agent](/img/LLMEndtoEndAgent.png)

Between these extremes is a hybrid approach in which we first prompt the LLM to construct a query that will find the information it needs to complete the summary, manually run the query, and pass the query results back to an LLM in another prompt that asks it to write the summary. 

![Hybrid](/img/LLMHybrid.png)

This spectrum captures the degree to which the software system cedes ownership of the control flow to the LLM. Ceding more control to the LLM can allow the system to exhibit more advanced behavior.

![Three options for LLMs](/img/LLMsTextSketch-Agents.drawio.png)

The One Pass LLM relies entirely on human input to structure the information that the LLM uses. The hybrid approach gives the LLM control over one search query but does not enable the LLM to request additional information. The End-to-End Agent system can sequentially issue multiple search queries of increasing refinement as it sees and interprets the results of earlier search queries. 

Choosing a spot on this spectrum requires a number of considerations. For example: if we expect the same query to the search API to be applicable to all questions that users may ask the Q/A system, then the One Pass LLM is probably sufficient. If we expect each query to require different underlying data then we may want to give the LLM control over the query logic.

Furthermore, an End-to-End Agent must track context across multiple executions and balance multiple input and output formats. Less powerful (cheaper) LLMs can struggle to do this effectively. In addition, these designs often involve a large number of LLM executions per query, which can be quite expensive. The One Pass and Hybrid LLMs are substantially cheaper.

Also, the more control we cede to LLMs, the larger the aperture for prompt injection. This [article](https://simonwillison.net/2023/Apr/25/dual-llm-pattern/) explores design patterns that minimize prompt injection risk.

## Context Windows

We often want to provide our LLM with more data than could fit in its context window. We can manage this in a number of different ways. 

One popular strategy is to use semantic search. We break the data into small chunks, represent each chunk with a text embedding, and store the chunks in a vector database. When we prompt our LLM we generate an embedding for the prompt, search the vector DB for the chunks with the most similar embeddings, and append these chunks to the prompt. 

Another strategy is to design a search API for the data and apply the End-to-End Agent strategy from the previous section. This approach cedes a bit more control to the LLM, but might surface more relevant data. 


## Conclusion

Designing software involves striking a delicate balance between various attributes and considerations. Engineers weigh factors such as simplicity, speed, cost, and effectiveness as they make design choices. Each design represents a different point on the tradeoff spectrum.

These design patterns are just a small glimpse into the strategies that engineers will explore as LLMs continue to permeate the software ecosystem. As LLMs become more prevalent, engineers will have the opportunity to explore numerous similar patterns, adapting and refining them to suit new contexts and requirements.

