---
layout: post
title: Parallel Progress Bar - An easy to use wrapper for concurrent.futures and tqdm
tags: [Python, Parallel, Concurrent, Futures, Progress, Bar, tqdm]
---
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

In this post. I'm also going to share a super easy-to-use method that you can use to turn any list comprehension into a high performance parallel job with a progress bar. 

### tqdm

If you are a python programmer who hasn't worked with tqdm before, I'm about to change your life. With just 6 additional characters of code, tqdm adds a helpful and non-obstrusive progress bar to any python iterator. Try this code:

```python
	from tqdm import tqdm
	for i in tqdm(range(10)):
		#do stuff
```

You should see a progress bar like this:

![Progress Bar](/img/Progress_Bar.png)

You can download tqdm [here](https://github.com/noamraph/tqdm).

### concurrent.futures

[concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html) is python's standard module for asyncronous tasks. It gives you access to executor classes that you can use to manage threads and processes. If you're not familiar with concurrent.futures, you can find a pretty good tutorial [here](http://masnun.com/2016/03/29/python-a-quick-introduction-to-the-concurrent-futures-module.html). 

### The Method

```python
from tqdm import tqdm
from concurrent.futures import ProcessPoolExecutor, as_completed

def parallel_process(array, function, n_jobs=16, use_kwargs=False, front_num=3):
    """
        A parallel version of the map function with a progress bar. 

        Args:
            array (array-like): An array to iterate over.
            function (function): A python function to apply to the elements of array
            n_jobs (int, default=16): The number of cores to use
            use_kwargs (boolean, default=False): Whether to consider the elements of array as dictionaries of 
                keyword arguments to function 
            front_num (int, default=3): The number of iterations to run serially before kicking off the parallel job. 
                Useful for catching bugs
        Returns:
            [function(array[0]), function(array[1]), ...]
    """
    #We run the first few iterations serially to catch bugs
    if front_num > 0:
        front = [function(**a) if use_kwargs else function(a) for a in array[:front_num]]
    #If we set n_jobs to 1, just run a list comprehension. This is useful for benchmarking and debugging.
    if n_jobs==1:
        return front + [function(**a) if use_kwargs else function(a) for a in tqdm(array[front_num:])]
    #Assemble the workers
    with ProcessPoolExecutor(max_workers=n_jobs) as pool:
        #Pass the elements of array into function
        if use_kwargs:
            futures = [pool.submit(function, **a) for a in array[front_num:]]
        else:
            futures = [pool.submit(function, a) for a in array[front_num:]]
        kwargs = {
            'total': len(futures),
            'unit': 'it',
            'unit_scale': True,
            'leave': True
        }
        #Print out the progress as tasks complete
        for f in tqdm(as_completed(futures), **kwargs):
            pass
    out = []
    #Get the results from the futures. 
    for i, future in tqdm(enumerate(futures)):
        try:
            out.append(future.result())
        except Exception as e:
            out.append(e)
    return front + out
```

The syntax for `parallel_process` is identical to the syntax for python's `map` function, but it is more customizable. The most basic use is:

![A basic progress bar](/img/basic_progress.png)

We can also specify additional arguments to the function

![A fancy progress bar](/img/fancy_progress.png)
