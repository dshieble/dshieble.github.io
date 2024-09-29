---
layout: post
title: Good Engineering Leadership
tags: [Engineering, Leadership, Management]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>


- encoder-only attention (self attention) has no separation between Q/K/V, all of these are just clones of the input
- encoder/decoder attention has the previous decoder layer output (transformed) into the query and the output of the encoder over the raw values transformed into the K/V

- self attention means everything connects to everything. in order to force autoregressivity in the decoder we use a mask at the level of attention
