---
layout: post
title: Efficacy Engineering
tags: [Software Engineering, Machine Learning, AI, Data Science]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

# What Is Efficacy Engineering?

Every system has properties that define its usefulness. We talk about **efficiency** when we care about speed and resource usage. We talk about **stability** when we care about consistency under load. We talk about **usability** when we care about how easy it is for a human to interact with the system.

But what about **efficacy**?

Efficacy is about whether the system *actually works*. Does it do the thing it’s supposed to do? If it makes predictions, are they accurate? If it takes actions, do they lead to good outcomes? If it helps a user, does the user get what they need?

In systems that make decisions - like ML models, heuristic engines, or AI agents - efficacy becomes a central concern. And yet, we don’t have a great shared name for the work of making these systems more effective. That’s where **efficacy engineering** comes in.

## A Common Thread Across Roles

There are many roles that focus on improving system outcomes:

- ML engineers and data scientists tuning models
- Detection engineers refining rules
- Generative AI engineers optimizing prompts and agents

They may use different tools, but they all share the same goal: take a system that does X, and make it *do X better*. This shared pattern of work is what we call **efficacy engineering**.

## The Core Ingredients

Every efficacy engineering problem involves three core components:

1. **Signals**: These are the inputs to your system, and the ultimate bottleneck on its performance. ML engineers call these features.
2. **Logic**: This is the decision-making mechanism. This could be a hand-coded heuristic, an XGBoost model, or a multi-agent LLM workflow. The process to improve this logic ranges from direct (make changes to a heuristic or prompt) to fully algorithmic (tune parameters in the training algorithm)
3. **Outputs**: These are the actions or decisions your system produces - predictions, alerts, rankings, summaries, etc.

Efficacy engineers trace the relationship from input to output, understand the failures, and make the whole system more effective.

## The Centerpiece: Evaluation Pipelines

The beating heart of efficacy engineering is an evaluation pipeline. A good evaluation pipeline allows you to:

- *Detect regressions*
- Benchmark improvements
- Guide iterative development

This could be a labeled test set, an offline replay framework, a simulation environment, or even a judgment-based rubric. What matters is that it allows you to *measure what matters* - consistently and quickly.

## Row-Level Inspection

Quantitative metrics get you 80% of the way there, but most of the breakthrough insights come from *qualitative inspection*.

Looking at individual mistakes - row by row - helps you uncover:

- Missing signals
- Broken assumptions
- Systemic errors
- Noisy labels and other shortcomings in evaluation metrics

This is where real progress often begins. When a system gets something wrong, the first question to ask is *why?*

## The Product Context Matters

Efficacy engineering rarely lives in a vacuum. Most systems are embedded in broader product ecosystems, and that context shapes how we measure success.

Consider an AI agent in a shopping app. Internally, we might track precision and recall on “did the agent find the right product?” But the product cares about monthly spend, not model accuracy. That disconnect means efficacy engineers must often bridge the gap with:

- Proxy metrics
- A/B tests
- Product intuition

Ultimately, the system’s improvements must drive meaningful changes in business outcomes, even if those outcomes can’t be directly optimized.

## The Three Pillars of Efficacy Expertise

Solving these problems requires a blend of three types of knowledge:

1. **Domain Knowledge**\
   Understand the stakes. What matters in this vertical? What does “wrong” actually look like? A spam model that flags the wrong emails is different from a model that misclassifies cyberattacks.

2. **Systems Knowledge**\
   Know how the data flows. Understand the data pipelines, transformation logic, and where things break. Systems knowledge is crucial in organizations with limited infrastructure or poor observability.

3. **ML/DS/AI Knowledge**\
   Finally, understand how to tune, interpret, and debug models. Know what tricks work. Know when to use an embedding vs. a feature count. Know how to build robust evals and effective test sets.

Not every efficacy engineer needs to be an expert in all three - but great teams cover the whole stack.

---

**Efficacy engineering** isn’t a job title (yet). But it’s a critical function in any organization that uses decision-making systems in production. And as these systems become more complex, so too will the need for engineers who know how to make them *work*.

If you're spending your time asking "why did the model do that?" and "how do we make it better?" - you're already doing efficacy engineering

