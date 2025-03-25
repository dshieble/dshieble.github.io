---
layout: post
title: Infrastructure as ... Markdown?
tags: [AI, Software Engineering]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

Ever had a complex Python function you wanted to quickly host as an API? Managing dependencies like databases, secret keys, or heavy utilities like audio processing libraries can be quite cumbersome. Typically, I handle this with a pattern involving:

- **Docker**: to manage and install dependencies
- **AWS Parameter Store**: to securely handle secrets
- **AWS Lambda**: for serverless hosting

This approach is powerful and flexible, but manually configuring Dockerfiles, IAM roles, and permissions repeatedly can be tedious - and the pattern is a bit too generic to encode with tools like terraform.

Enter vibe coding. I wrote a detailed markdown file documenting this exact process—clearly enough that even a junior engineer could follow (you can find it [here](https://github.com/dshieble/method_to_lambda_prompt/blob/main/guidelines.md)). Now, whenever I need to deploy a new Python function to Lambda, I simply hand Cursor this markdown file along with the Python function and let it 🧑‍🍳.

## What's Going on Here?

We're exploring a new approach: Infrastructure as Markdown. Unlike traditional infrastructure as code (IaC), which is highly structured and explicit, markdown combined with AI coding tools offers a more intuitive way to define infrastructure. AI interprets general, human-readable instructions and adapts flexibly without extensive manual tuning.

## Speculating on the Future

This AI+markdown-based approach is a shift from traditional DevOps. At the cost of allowing things to sometimes go off the rails (and they do!) this dramatically simplifies infrastructure management, making it accessible to those who might not be deeply versed in cloud infrastructure tools. If markdown documentation becomes a form of executable infrastructure, clarity in writing could soon surpass traditional scripting or configuration languages in importance.

This approach is still pretty limited today. Large infrastructure configurations tend to consist of the huge overly structured files that befuddle modern AI coding tools. But make no mistake - this is the future.

