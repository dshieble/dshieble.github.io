---
layout: post
title: Making (Correct) Decisions with Data
tags: [Engineering, Leadership, Data Science]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

<!-- Many key technical decisions are informed by data. Unfortunately data is hard.  -->

Sloppy analytics can lend false confidence to bad decisions. Leaders who understand a few common pitfalls can make better decisions from data.

The most common pitfall is underspecification. The answer to a simple-seeming question like "are users more likely to churn if they see more than 3 ads on their first day" can quickly switch between "yes" and "no" depending on which of several plausible sounding definitions of "churn" or "see more than 3 ads" are chosen. Generally only one specification of a question is actually relevant to a business decision.

For example, a team deciding whether to increase the number of ads that a user sees on the front page should refine the question from "see more than 3 ads" to "see more than 3 front page ads" to get the right answer for their business problem. We can get to the right specification by adding clarifications to each question until this ambiguity disappears.

It's often infeasible to get an answer to the maximally specified question. For example, perhaps the only dataset of user ad impressions that is available does not stratify by display location. However, simply understanding the gap between the question that we have an answer to (...see more than 3 ads...) and the question that we want an answer to (...see more than 3 front page ads...) helps us correctly calibrate our decision making confidence.

<!-- (see [this article](https://danshiebler.com/2017-10-29-lying-with-data/) for several examples). -->

Another common pitfall is data "gotchas". For example, perhaps the primary dataset that stores ads displayed to users is de-duplicated by ad campaign. An analysis that uses this dataset to count the number of ads that a user sees in a day will be an undercount - jeopardizing the correctness of the analysis. Making the right decisions requires identifying these gotchas and routing analyses away from them.

There is one particularly powerful strategy to improve critical analyses. First, break down the key decisions and assumptions. Then demonstrate the same conclusion using a different set of assumptions - and ideally a different set of data. This approach can reduce risk and dramatically increase our confidence in a conclusion.

For example, we might be able to estimate the number of ads that a user saw by looking at client events (generated by the user's device) or server events (generated by the server that sent the ad to the user's device). These different data sources will be wrong in different ways. For example, client events might be noisier and missing for many users, but server events may be incorrect if some display logic executes on the client. We can have way more confidence in any conclusion independently supported by both sources. 

Data-driven decision making is powerful but fundamentally limited. The best decisions come from combining data with other decision making strategies - like intuition and first principles reasoning.