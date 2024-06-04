---
layout: post
title: Technical Inspection
tags: [Engineering, Leadership, Architecture, Management]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

The CEO needs to increase company margins. He turns to the engineering leadership team to help.

Engineering leadership puts together a sound plan. First the objective to "Increase Company Margins" is decomposed into a collection of eng-level goals like "Reduce Tier 2 Support Hours". Each of these eng-level goals decompose into org-level goals like "Reduce Customer Onboarding Tier 2 Support Escalations", which decompose into team-level goals like "Reduce Customer Onboarding Exceptions".

![Company margins project breakdown](/img/company-margins-project-breakdown.png)

At the surface it may seem like the problem is nearly solved. Each engineering team just needs to achieve their individual goals, and the solutions will roll up into the org level goals. But the work of engineering leadership has just begun.

The engineer tasked with reducing customer onboarding exceptions is unlikely to understand the relationship of this workstream with company margins - they may or may not even know what Tier 2 support is. The great game of corporate telephone can easily send them down the wrong road. For example, suppose the engineer reviews recent customer onboarding exceptions, identifies a flaky service dependency as a common root cause, and then writes a design to remove the dependency. This will likely read as a solid plan to someone reviewing the design at a surface level.

But perhaps the specific exceptions triggered by this flaky service dependency do not require Tier 2 support to resolve!

![Tier 2 support required breakdown](/img/tier2-support-required-breakdown.png)


Then fixing these exceptions is not required to remove Tier 2 support, and the engineer's plan is sideways to the key business goal. 

## Technical Inspection

Engineering organizations have a small number of key decision makers - sometimes engineering managers, sometimes tech leads - with the right business and technical context to keep plans within the thin intersection of 'technologically sound', 'business optimal', and 'operationally feasible'.

![Venn Diagram](/img/venn-diagram.png)

These individuals drive technical inspection - owning and inspecting plans and decisions to ensure alignment with business needs and technical reality. 

This breaks into two critical responsibilities:

*Define Success Criteria*

Success criteria should be minimal, comprehensive, and written. It should not be possible to achieve these goals and still fail, but any solution that misses a single goal must be a failure. 

It's often helpful to write non-goals alongside success criteria. For example, a non-goal for the "reduce customer onboarding exceptions" workstream might be "reduce customer onboarding exceptions that don't require Tier 2 support".

*Inspect the Design*

There is no substitute for personally convincing yourself that a technical design meets the success criteria that you have written. 

It's impossible to write a good success criteria without having some idea of what shape the solution might take, so this is usually a good place to start. This generally looks something like:
> The obvious fix is just to do X, but this has the obvious downside of Y. If this design proposes X, does it describe how we will handle Y? If this design doesn't propose X, does it describe how we will get the benefits of X in a different way? 

However, design inspections are generally a terrible place to micromanage details. Success criteria should be prescriptive and tops down, but solutions must be bottoms up. Overly prescriptive tops down solutions subvert the unique context that only an engineer with their hands on the keyboard will have.

## Data and Decisions

<!-- A critical part of technical inspection is signing off on key technical decisions -  -->
<!-- Business leaders generally treat data that confirms their hypotheses as gospel. Ownership of analytical correctness generally lies with the engineers and data scientists running the analyses. -->


Many key technical decisions are informed by data. Unfortunately data is hard. 

The most common pitfall is underspecification. The answer to a simple-seeming question like "are customers more likely to churn if they see more than 3 ads on their first day" can quickly switch between "yes" and "no" depending on which of several plausible sounding definitions of "churn" or "see more than 3 ads" are chosen (see [this article](https://danshiebler.com/2017-10-29-lying-with-data/) for several examples).

Generally only one specification of a question is actually relevant to a business decision. The decision of whether to increase the number of ads that a user sees on the front page requires data on the impact of front page ads on user churn - not just ads in general. Inspection requires understanding this relevant specification and identifying cases of underspecification or misspecification in an analysis.
 <!-- Technical inspection requires understanding whether the chosen question specification is the right one in the context of the relevant business decision. -->


Another common pitfall is data "gotchas". For example, perhaps the primary dataset that stores ads displayed to users is de-duplicated by ad campaign. An analysis that uses this dataset to count the number of ads that a user sees in a day will be an undercount - jeopardizing the correctness of the analysis. Technical inspection requires identifying these gotchas and routing analyses away from them.

There is one particularly powerful strategy to improve critical analyses. First, break down the key decisions and assumptions. Then demonstrate the same conclusion using a different set of assumptions - and ideally a different set of data. This approach can reduce risk and dramatically increase our confidence in a conclusion.

## Balance

A culture of technical inspection is a culture of accountability. Every engineering leader should feel personally responsible for every technical decision that their team makes.

But the best leaders are not zealots. Technical inspection must be applied from a position of two-way trust. Leaders must trust that their engineers will make the right decisions with the right context, and engineers must trust that their leaders will embrace a solution that is unfamiliar to them but correct. 

Adding structure to technical inspection helps build this trust. Frequent design reviews with substantial leadership time commitment adds predictability and forces alignment.

Ultimately a balanced and trust-forward approach to technical inspection produces the best results. 





<!-- 
Engineering leaders have a tough job.

In tech companies, strategic execution on product direction is bottlenecked by engineering. Shifting business and product strategies require engineering organizations to constantly evolve their roadmaps and execution plans - while staying within the thin intersection of 'technologically sound', 'business optimal', and 'operationally feasible'.

![Venn Diagram](/img/venn-diagram.png)

<!-- Engineering leaders are responsible for charting a course towards this optimal point. This is quite difficult - large (>30 people) engineering organizations devolve into games of telephone quickly.  -->
<!-- 
Large organizations can develop games of telephone that effectively freeze these decisions for months or years. Only systems of high bandwidth communication break these barriers and enable nimble decision making.
 -->






<!-- Technical inspection that morphs into micromanagement leads to disempowered and ineffective teams. -->

<!-- There is no substitute for detailed technical inspection of roadmaps, designs, and plans. It is the engineering leader's most powerful tool to cut through corporate telephone and create a resilient plan.  -->





<!-- Engineering leaders who hire leaders under them should expect to continue to involve themselves in technical inspection for longer than  -->



<!-- Technical inspection becomes increasingly difficult as an organization scales. Leaders higher up the chain will need to carefully balance empowerment+delegation and inspection+accountability. Growing organizations are particularly vulnerable. New hires, even experienced and capable engineering leaders, struggle to perform effective inspection. Many of the most pernicious gotchas - both at the level of technical deliverables and business context - can take many months for a new employee to understand and internalize.  -->

<!-- Technical inspection is the only way to really determine whether things are moving in the direction you need and the most effective way to redirect it


We've only scratched the surface of technical inspection in this post. In the next post we'll talk about some tactics that are useful when performing technical inspection



 Organizations needs to draw a 

It's crucial for each layer of leadership to communicate the key areas on which they depend on 



can't delegate to new hires as easiler



Communicating success criteria is key

- 

- enablement and delegation are important
- this is extra hard if you are new in an organization
- trust is key, you need to understand who is the expert

## Looking Forward -->






<!-- 


 of chasing irrelevant exceptions or even shifting support hours from Tier 2 support to engineering. 

Unfortunately, it is rarely obvious to business



push things forward confidently. These individuals own technical inspection - owning and inspecting plans and decisions to ensure that they are aligned with business needs and technical reality. 



Every engineering leader is responsible for making sure this does not happen on their team.
 -->




<!-- TODO: The clear point here is not that decisions in businesses are complex - it is that even if we write a good plan on paper, actually bringing it forward, propagating changes up and down as reality shows its ugly face etc - requires the right processes and people  -->









<!-- The CTO might decompose this objective into an collection of eng-level goals like "reduce tier 2 support hours", and the engineering leadership team might further decomposedecompose eng-level goals might decompose into org-level goals like "enable a self-service setup flow", which might decompose into team-level goals like "reduce customer ingestion exceptions". -->





<!-- 
This requires a small number of key decision makers - sometimes engineering managers, sometimes architects, sometimes technical leads -  with the right business and technical context to push things forward confidently. These individuals own technical inspection - owning and inspecting plans and decisions to ensure that they are aligned with business needs and technical reality. 

## Technical Inspection


The CTO is personally responsible for the soundness of every technical decision in their organization. In a large organization this requires delegation to trusted leaders.


Delegation 


Engineering leaders hold the ultimate responsibility for 

Every technical initiative 


## Interfaces

Most engineering workstreams trickle down, directly or indirectly, from high level business goals. 



 -->


















<!-- 




 a design means signing off on its soundness, but 



* Inspect the technical design for each workstream to verify that it meets this success criteria






In a healthy organization any team-level goal like "reduce customer ingestion exceptions" 

must pass through technical inspection by a 




- very high leverage to inspect how an engineering plan does or does not yield this success

- what are possible success criteria?
  - absolute minimum goals
    - are there ways we could achieve these goals and still fail?
  - clear non-goals
  - what is the correct point in the middle zone?
- sanity checks
  - how could these goals be achieved in a degenerate way?



. This definition can then serve as a tool for the leader to match whether technical deliverables meet that success criteria.


 quality of their solution will be bottlenecked by how well they understand the problem at hand. 




 unlikely to have sat in the meeting with finance where tier 2 support hours were identified as critical to reduce. 





 goal a design for a new customer onboarding service is probably not thinking about tier 2 support hours.





 working on the ground on a particular workstrem may not fully understand the goals for how their workstream supports them.



* Reduce support costs through a new self-service setup flow
* Reduce the number of SREs required to prevent system outages in the future

Which might decompose into

Goals lie

* Increase average revenue per user by launching a new product line to upsell existing customers
* Enable sales in regions outside of the US 





As a result, there are usually two sets of "success criteria" that 


- unclear exactly how that criteria will alig



- very high leverage to inspect how an engineering plan does or does not yield this success

- what are possible success criteria?
  - absolute minimum goals
    - are there ways we could achieve these goals and still fail?
  - clear non-goals
  - what is the correct point in the middle zone?
- sanity checks
  - how could these goals be achieved in a degenerate way?


## Solution Criteria

- what is the shape of the solution space?
  - high level objective
    - how does this solution meet that objective?
  - main tradeoffs
    - which tradeoffs are being taken?
  - key unknowns or decision points -->




<!-- 

## Scope



- understand and enforce the correct scope
  - decision
    - what are the range of results that make sense based on what has been done in the past?
    - do numbers match up
  - tech designs
  - sanity checks
    - 

 -->





<!-- 

### strategy

- if we are making a claim, show the result with multiple sources of data that have uncorrelated errors



Technical inspection generally breaks down into one of two subcategories. -->
<!-- 
T

This generally requires understanding the exact question what 

The first is 
  - build confidence in a system or experiment design
    - could be more experiment-like (ML, UX) or more system-like (refactor a service)
    - often informed by data
  - build confidence in analyses 
 -->




<!-- 

- execution checks -->

<!-- Business priority shifts, product evolutions, and customer feature requests all need to pass through 

As the execution arm of most companies, the engineering organization needs to implement business priorities or product direction shifts, 


Shifting business realities and product requirements force engineering organizations to constantly evolve their roadmaps and execution plans. Each evolution must occupy a  -->
<!-- need to be able to incorporate product requirements, business requirements, and technical/operational reality into their decisions.


Only a small number of individuals have both the



for technical inspection - the process of ensuring that technical decisions 

Since these engineering leaders are rarely positioned to drive implementations directly, they need to inspect and lead other engineers.  -->



<!-- Effective engineering execution depends on technical inspection. Decisions 

- technical inspection is a critical part of engineering leadership
  - engineering organizations need to make technical decisions
  - these decisions needs to be appropriately informed by product requirements, business requirements, and technical/operational reality
  - only a small number of individuals have both the right context on busness needs and the right understanding of technical systems to make these decisions
    - sometimes these are engineering managers, sometimes they are technical leads, sometimes architects
  - as organizations grow these individuals are rarely driving the implementation directly, they usually need to work through inspecting and leading other engineers -->


<!-- 
Every engineering organization needs a core group of people who deeply understand both business context and technical reality.



todo - game of telephone


different in each large organization but what they have in common is their ownership of technical inspection. 




Technical inspection




This exists at many levels. Anybody

what people think the data says and what it actually says, what the code is supposed to do and what it actually does, what the 


Software development can look very different to a business leader and an engineer. Bridging 

An objective like "increase company margins" might decompose into a goal like
* Reduce support costs through a new self-service setup flow
* Reduce the number of SREs required to prevent system outages in the future

Which might decompose into

The ultimate success of an engineering workstream is defined by high level business goals. -->
