---
layout: post
title: Makign Decisions with Data
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

Many key technical decisions are informed by data. Unfortunately data is hard. 

The most common pitfall is underspecification. The answer to a simple-seeming question like "are customers more likely to churn if they see more than 3 ads on their first day" can quickly switch between "yes" and "no" depending on which of several plausible sounding definitions of "churn" or "see more than 3 ads" are chosen (see [this article](https://danshiebler.com/2017-10-29-lying-with-data/) for several examples).

Generally only one specification of a question is actually relevant to a business decision. The decision of whether to increase the number of ads that a user sees on the front page requires data on the impact of front page ads on user churn - not just ads in general. Inspection requires understanding this relevant specification and identifying cases of underspecification or misspecification in an analysis.
 <!-- Technical inspection requires understanding whether the chosen question specification is the right one in the context of the relevant business decision. -->


Another common pitfall is data "gotchas". For example, perhaps the primary dataset that stores ads displayed to users is de-duplicated by ad campaign. An analysis that uses this dataset to count the number of ads that a user sees in a day will be an undercount - jeopardizing the correctness of the analysis. Technical inspection requires identifying these gotchas and routing analyses away from them.

There is one particularly powerful strategy to improve critical analyses. First, break down the key decisions and assumptions. Then demonstrate the same conclusion using a different set of assumptions - and ideally a different set of data. This approach can reduce risk and dramatically increase our confidence in a conclusion.

