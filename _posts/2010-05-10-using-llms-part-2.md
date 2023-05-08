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


## Introduction

> This post is part two in a two part series on how to make optimal use of LLMs in a production machine learning system. Find part one [here](https://danshiebler.com/2023-05-08-using-llms-part-1) 

Generative large language models (LLMs) like ChatGPT have changed the game. Previously impossible problems are now solvable without substantial time investment or labeled data. This has tremendous implications for the future of software develoment, data science, and machine learning engineering.

LLMs have unique interfaces and limitations which shape the software ecosystems around them. In this series we explore how to make optimal use of these models as components of a software system.



## Paradigms

Context window management
Tool expectations
Implicit Agents vs Explicit Agents
	- how much logic to offload to the model?
Balancing


## Context Windows



## Conclusion

Humans understand language. We produce a lot of it, about a lot of different things, in a lot of different ways. We use language to understand and communicate with the world around us.

LLMs tap into the text data that we leave behind to form a world model that mimics ours. This text data contains artifacts of human reasoning. By transforming a problem to a text representation LLMs can parrot this reasoning - even without labeled training examples. This is a completely different way of solving problems than the strategy employed by traditional ML models, and can be superior when we only have a small amount of data or very noisy labels.

In the next post we will explore some different paradigms for using and optimizing LLMs.




















<!-- There are many problems in which we only have <!-- a small amount of data or very noisy labels. --> In these cases LLMs  -->


 <!-- there may be a large gap between the performance of a trained human labeler and a traditional ML model. In these cases transforming the data to text and passing it to an LLM may be the most powerful strategy. -->




<!-- The field of prompt engineering has sprung up around the careful construction of text commands that elicit desired behavior from LLMs. -->


<!-- There are many different kinds of prompt engineering, but one of the most interesting is what we might call the "ML translation". Given an ML problem with a set of well engineering features -->


<!-- One of the most striking things when working with LLMs is the realization that their primitive understanding of the world is text.

They consume this text as 


The float representation enables computer systems to use this binary representation to operate on real numbers.


Computers understand data in terms 
 -->






