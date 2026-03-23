---
layout: post
title: Bayesian Attack Detection for Smarter SOCs
tags: [Detection, Security, Statistics]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

# From One Agent to Many

*The math behind multi-agent ensembles is simpler than you think -- and it tells you exactly when adding agents helps.*

You've built an AI agent that investigates anomalies. A detection rule fires -- unusual login location, impossible travel, a service account calling an API it's never touched before -- and your agent pulls context, reasons about it, and decides: malicious or benign? It's 85% accurate. Your boss asks: "Can we make it better by running multiple agents and having them vote?"

The answer is *it depends* -- but the math fits on a napkin.

## The Independent Case

Think of each agent as a biased coin that lands heads ("correct") 80% of the time. Flip three coins and go with the majority: the probability that at least two land heads is `3p^2 - 2p^3 = 0.896`. Three agents instead of one: 80% to 89.6%, a 48% error reduction. Five agents hit 94.2%. Fifteen hit 99.6%. Error drops exponentially with agent count -- this is **Condorcet's Jury Theorem** (1785).

The catch: coin flips are independent by definition. Anomaly investigations are not.

## Correlated Errors Change Everything

Call Claude three times with the same prompt and the same anomaly. All three calls share the same training data, the same biases. When the model struggles -- say, deciding whether a service account's new API call is lateral movement or a legitimate infrastructure change -- it struggles all three times.

We measure this correlation with **rho**, ranging from 0 (independent) to 1 (identical errors). The ensemble variance formula tells the story:

```
Var(ensemble) = rho * sigma^2 + ((1 - rho) / M) * sigma^2
```

The first term -- `rho * sigma^2` -- is the **irreducible floor**. No number of agents can eliminate it. Only the second term shrinks with more agents. At rho = 0.9, going from 3 to 100 agents improves variance reduction from 6.7% to 9.9%. The floor dominates.

In practice, rho varies dramatically depending on how you build your ensemble:

- **Same model, same prompt, 3 calls:** rho ~ 0.90-0.95. You're paying 3x for near-zero improvement.
- **Same model, different prompts** (e.g., "is this anomaly malicious?" vs. "construct the most likely benign explanation for this anomaly"): rho ~ 0.6-0.8.
- **Different models, different prompts:** rho ~ 0.4-0.7. Different model families do exhibit different failure modes, but this gap is narrowing as training methodologies converge.
- **Different models, different prompts, different evidence** (one agent sees the raw logs and network context, another sees identity and access patterns, a third sees endpoint telemetry): rho ~ 0.3-0.5. This is where ensembling shines -- each agent reasons about the anomaly from genuinely different evidence.

## Measure Correlation Where It Matters

A single rho across all anomalies hides the thing that will hurt you. You need to decompose by outcome class:

- **rho on false negatives:** Agents that share the same blind spots will all call the same malicious anomalies "benign." If this is high, your ensemble's ability to catch real threats barely improves over a single agent. This is the killer -- the novel TTPs, the slow-and-low intrusions, the living-off-the-land techniques are exactly the anomalies where every agent shares the same blind spots.
- **rho on false positives:** Agents that all label the same benign anomalies "malicious" waste analyst time in lockstep. Voting doesn't reduce the noise.

Take 200+ anomalies with known ground truth. Run each agent independently. For each pair, compute the **phi coefficient** -- the Pearson correlation for binary outcomes -- separately on the anomalies they wrongly called benign and the ones they wrongly called malicious. A quick sanity check: if Agent A's error rate is 15% and Agent B's is 18%, independent errors predict both-wrong at 2.7% of cases. If you observe 10% both-wrong, your agents are highly correlated.

If phi on false negatives exceeds 0.7, don't add more agents of the same kind. You need agents that reason about the anomaly from structurally different angles.

## Diversity Is the Mechanism

For agents that produce continuous scores, the **Ambiguity Decomposition** makes the mechanism precise:

```
Ensemble Error = Average Individual Error - Average Diversity
```

Diversity -- disagreement between agents -- directly subtracts from error. An agent that constructs the best benign explanation for an anomaly while another builds the case that it's malicious creates errors in opposite directions. The math rewards this. If all three agents score the anomaly at 0.7 malicious, diversity is zero and the ensemble error equals the individual error. You paid for three agents and got the accuracy of one.

One caveat: this identity assumes calibrated scores. LLM confidence scores are notoriously miscalibrated, so a score of 0.7 from one agent may mean something very different than 0.7 from another. Apply **Platt scaling** (logistic regression on held-out scores vs. true labels) to each agent before averaging. Without calibration, prefer binary voting over score averaging.

## Cascades Cut Costs

Not every anomaly needs your full ensemble. A **cascade** runs agents in sequence -- each gate escalates only the uncertain cases. A fast agent at $0.01/anomaly handles 65% confidently (obvious benign activity, clear-cut malicious patterns), with a $0.50 deep investigation on escalation: `$0.01 + 0.35 * $0.50 = $0.185` vs. $0.50 per anomaly. That's a 63% cost reduction.

The key design principle: make early gates nearly lossless on catching real threats, even at the cost of passing through more benign anomalies. Later gates sort out the false alarms, but no gate recovers a malicious anomaly that was dismissed early. In our pipeline, gate 1 runs at 99.5% detection with a 60% false alarm pass-through, and by the third gate we're at 96.5% detection with 95.2% of false alarms eliminated.

The tradeoff versus parallel ensembles is latency. Cascades add latency sequentially; parallel ensembles add latency equal to the slowest agent. Choose cascades when cost matters more than response time.

## Putting It Together

The question worth asking about any multi-agent design choice: *does this make my agents' errors more or less independent?*

Measure rho, especially on the anomalies your agents wrongly dismiss as benign. Compute the floor. Track the diversity term. Calibrate before averaging scores. Design cascades with high-recall early gates. Then ablate -- remove each agent one at a time, and cut the ones that don't move the needle. The ensemble that works isn't the one with the most agents. It's the one where each agent is wrong about different anomalies.
