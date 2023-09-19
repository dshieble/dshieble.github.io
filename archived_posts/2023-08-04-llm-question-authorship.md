---
layout: post
title: Taming the Wild Genius of Large Language Models
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


This post is a war story.

Let's set the stage. Suppose a math teacher is teaching a lesson, such as "use your knowledge of how to find the zeros of a quadratic function to solve real world problems." Part of teaching this lesson is assigning homework and exam questions to evaluate students' understanding.

These questions can be time consuming for them to create. GPT to the rescue! 
![stone throw problem](/img/model_rocket_problem.png)

Looks great! Let's try one more:
![model rocket problem](/img/model_rocket_problem.png)


That one looks great too! Or does it? If we dig a bit deeper, we can see that GPT's answer is wrong! 


## The Problem


There are two major pitfalls of using a large language model to generate questions like this. First, large language models are generally bad at math. The internet is riddled with examples of GPT failing to do simple arithmetic operations.

![cube root of 123](/img/cube_root_123.png)

Second, large language models are prone to hallucination, in which the model simply makes something up. For example, if GPT generates the question:

**Question**: Bobby throws a ball into the air, and the height of the ball relative to the ground can be modeled with the function $$t^2 + t + 2$$ where $$t$$ is the amount of time since Bobby threw the ball. If Bobby throws the ball at $$t=0$$, when does it hit the ground?

The model may fail to recognize that this quadratic does not have zeros and confidently claim that the answer is some seemingly plausible number, such as $$t=0$$.

For a teacher who wants to use GPT-generated questions, this can be a major hassle. The teacher can't trust that a random question is not wildly wrong, so they need to validate each one by hand. This is time consuming and expensive.

An automated GPT-generated question validator would change this. With a validator in hand, we could design a system that generates tons of questions, passes each one the validator, and then only report validated questions to the teacher. 

Explicitly, given a math problem and solution (both expressed in LaTeX) we want to validate that the provided solution is correct. This is made extra tricky by the fact that the GPT-generated problems may have no solution at all.

There are two principles that this validation system needs to follow. First, GPT can never be permitted to perform any arithmetic operations itself. Arithmetic computations that GPT performs have a nontrivial probability of being completely wrong. Furthermore, there is probably an argument that 

*P(computation is wrong while validating question X)*
is positively correlated to

*P(computation was wrong while generating question X)*

and therefore allowing GPT to do arithmetic computations during validation defeats the purpose of doing validation to begin with.

Second, GPT can never be relied upon to compare two numbers. GPT can hallucinate relationships between numbers in weird ways
![cube root of 123](/img/bad_numerical_comparison.png)

## The Solution
One way to accomodate both of these constraints is to ask GPT to write python code that solves the problem rather than to solve the problem itself. The system then performs all arithmetic operations and comparisons programmatically. We never rely on GPT to do any math itself.

Our first step is then to present the problem to GPT and ask it to write code that generates the solution. I chose sympy as my mathematical package of choice for GPT to leverage. For example, given the problem
**Question**: Bobby throws a ball into the air, and the height of the ball relative to the ground can be modeled with the function $$t^2 + t - 2$$ where $$t$$ is the amount of time since Bobby threw the ball. If Bobby throws the ball at $$t=0$$, when does it hit the ground?


GPT generates the code
```
import sympy as sp

# Define the variable
t = sp.symbols('t')

# Define the quadratic equation
equation = t**2 + t - 2

# Solve the equation for t
solutions = sp.solve(equation, t)

# Filter out any complex or negative solutions
real_solutions = [sol for sol in solutions if sp.re(sol).is_real and sp.im(sol) == 0 and sol >= 0]

# Set the variable answer equal to the solution
if len(real_solutions) == 0:
  answer = None
else:
  answer = max(real_solutions)
```
Which we can run to get the solution
```
1
```

Now suppose that GPT had originally generated the solution
**Solution**: Bobby's ball will land on the ground 1 second after he throws it.

How can we verify that these solutions are equivalent? We can’t simply ask GPT, since this would require allowing GPT to perform a numerical comparison: which it will sometimes get wrong.

We can take a slightly more nuanced approach and instead ask GPT to complete the following program
```
... # code that GPT wrote already

# Set the variable answer equal to the solution
if len(real_solutions) == 0:
  answer = None
else:
  answer = max(real_solutions)
original_answer = ... # The line to complete
answer_is_correct = new_answer.equals(original_answer)
```
In this case GPT will write the code
```
original_answer = 1
```
and if we run this the system will validate that the original solution is correct.






## Conclusion

Autogenerating math problems and solutions via AI has the potential to make life dramatically easier for teacher. However, it carries with it two major issues: the propensity for the AI to make mistakes with computation, and the risk of the AI inventing nonexistent relationships between numbers or operations.

The solution suggested here bypasses these problems by asking GPT to write Python code that validates the solutions it produces. This is not foolproof: GPT may make mistakes writing the Python code as well. But code is more structured than text, so hallucinations are more likely to result in runtime errors than incorrect validations.

Anytime we need an AI to generate factual or deterministic content, we must take precautions to maintain accuracy. Independent validation through executable code is a powerful and general strategy to increase AI reliability.








<!-- 
<!-- **Question**: Bobby throws a ball into the air, and the height of the ball relative to the ground can be modeled with the function $$t^2 + t - 2$$ where $$t$$ is the amount of time since Bobby threw the ball. How many seconds after Bobby throws the ball does it land on the ground?
**Answer**: One second -->

Similarly, if we provide the question
**Question**: Bobby throws a ball into the air, and the height of the ball relative to the ground can be modeled with the function $$t^2 + t + 2$$ where $$t$$ is the amount of time since Bobby threw the ball. If Bobby throws the ball at $$t=0$$, when does it hit the ground?

GPT generates the code
```
import sympy as sp

# Define the variable
t = sp.symbols('t')

# Define the quadratic equation
equation = t**2 + t + 2

# Solve the equation for t
solutions = sp.solve(equation, t)

# Filter out any complex or negative solutions
real_solutions = [sol for sol in solutions if sp.re(sol).is_real and sp.im(sol) == 0 and sol >= 0]

# Print the solutions
if len(real_solutions) == 0:
    print("None")  # No real, non-negative solutions
else:
    for sol in real_solutions:
        print(f"The ball hits the ground at t = {sol}")
```
Which we can run to get the solution
```
None
```
 -->