---
layout: post
title: PCA vs Laplacian Eigenmaps
tags: [Dimensionality Reduction, PCA, Laplacian Eigenmaps]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

<!-- http://www.math.ucsd.edu/~fan/research/cb/ch1.pdf -->
<!-- https://www2.imm.dtu.dk/projects/manifold/Papers/Laplacian.pdf -->

<!-- Generalized EigenProblem: https://www.geo.tuwien.ac.at/downloads/tm/svd.pdf -->

On the surface, PCA and Laplacian Eigenmaps seem both very similar. We can view both algorithms as constructing a graph from our data, choosing a matrix to represent this graph, computing the eigenvectors of this matrix, and then using these eigenvectors to determine low-dimensionality embeddings of our data.

However, the algorithms can produce very different results, primarily due to the fact that PCA is a linear dimensionality reduction algorithm that makes few assumptions, whereas Laplacian Eigenmaps is a nonlinear dimensionality reduction algorithm that assumes that the data lies on a low-dimensional manifold.

We can explicitly characterize this divergence in terms of three key differences between the algorithms:
* The graph we construct from our data
* The choice of matrix representation of this graph
* The choice of eigenvectors of this matrix to determine the low-dimensionality embeddings

In the following exposition, we will assume we have $$n$$ data points and $$d$$ features, represented in a data matrix $$X$$ with shape $$n x d$$. For simplicity we will assume that our data is already normalized and zero-centered.


## PCA
In PCA, we form a fully connected grqph such that the edge between each pair of vertices has weight equal to the dot product of the corresponding data vectors. We represent this graph with the adjacency matrix, $$X^T X$$. For some $$d' < d$$ our objective is then to construct the $$n x d'$$ matrix $$X'$$ such that the following quantity is minimized.

$$\sum_{i,j} (X'^T X' - X^T X)_{ij}^2$$

In order to do this, we implicitly compute the eigenvectors $$v$$ corresponding to the $$d'$$ largest eigenvalues $$\lambda$$ of the $$n x n$$ matrix $$X^T X$$ and define the jth element of the ith data point's embedding to be $$v_{j_i}*\lambda_{j}^{1/2}$$. That is, the product of the ith element of the jth eigenvector and the square root of the jth eigenvalue. In practice we implement this with SVD rather than explicitly form the matrix $$X^T X$$ 

Because PCA operates over the fully connected graph, all pairwise relationship between data vectors (i.e. elements of $$X^T X$$) are considered equally important, and the optimization objective is framed in terms of reconstructing the exact distances between points.

## Laplacian Eigenmaps
In contrast, in Laplacian Eigenmaps we form a different graph based on a nonlinear transformation of our data, and then compute the generalized eigenvectors of the Laplacian matrix of this graph. 

We begin by choosing a number $$k$$ and building a graph such that there is a unit-weight edge connecting vertex $$v_i$$ and $$v_j$$ if $$v_i$$ is one of the kth nearest neighbors of $$v_j$$ or vice-versa (in some implementations of Laplacian Eigenmaps, the weight of this edge is inversely proportional to the distance between the data vectors corresponding to $$v_i$$ and $$v_j$$). 

Now for some $$d' < d$$ our objective is then to construct the $$n x d'$$ matrix $$X'$$ such that the following quantity is minimized subject to a few constraints around orthogonality and embedding normalization. Note that $$x'_i$$ is the ith row of $$X'$$ and that $$i \sim j$$ if there is an edge between $$v_i$$ and $$v_j$$:

$$
\sum_{i,j \|\ i \sim j} (x'_i - x'_j)^2
$$

In order to do this, we compute the eigenvectors $$v$$ corresponding to the $$d'$$ smallest eigenvalues for the generalized eigenproblem $$Ly = \lambda Dy$$, where $$D$$ is the $$n x n$$ diagonal matrix where the ith diagonal entry is the degree of $$v_i$$. Note that this is equivalent to computing the eigenvectors of the matrix $$D^{-1}L$$. Then we define the jth element of the ith data point's embedding to be $$v_{{j}_i}$$, or the ith element of the jth smallest eigenvector.

Unlike PCA, the Laplacian Eigenmaps algorithm does not try to preserve exact pairwise distances, or even relative pairwise distances between far away points. The algorithm exclusively focuses on mapping the embeddings corresponding to nearest neighbors as close together as possible.


## Summary

##### Graph
* **PCA**: Fully connected graph where weights of the graph are determined by the dot product between data points
* **Laplacian Eigenmaps**: Graph where an edge only exists between $$v_i$$ and $$v_j$$ if $$v_i$$ is one of the kth nearest neighbors of $$v_j$$ or vice-versa

##### Matrix
* **PCA**: The adjacency matrix
* **Laplacian Eigenmaps**: The Laplacian matrix

##### Eigenvectors
* **PCA**: The eigenvectors corresponding to the $$d'$$ largest eigenvalues
* **Laplacian Eigenmaps**: The eigenvectors corresponding to the $$d'$$ smallest eigenvalues

















<!-- 

















Generalized eigenvectors/eigenvalues minimize the Rayleigh quotient, which is large when points that are connected in the graph are mapped away from each other

The eigenvectors of the




the vertices  each data vector pair of neighbors 



aim to minimize the squared reconstruction error of the pairwise covariances. 







However, PCA is a linear dimensionality reduction algorithm that essentially aims to directly minimize the difference between the squared 



aims to preserve the maximal variance 

(if we)

t such that the following quantity is minimized, where $$i \sim j$$ if there is an edge between $$v_i$$ and $$v_j$$ and $$d_{v_i}$$ is the degree of $$v_i$$:

$$
\frac{
  \sum_{i,j \|\ i \sim j} (x'_1 - x'_0)^2
}{
  \sum_{i} (x'_i)^2 d_{v_i}
}
$$





are implicitly compute the eigenvectors of a matrix 

(in )


$$\{0,1\}$$ or $$\mathbb{R}$$.


In PCA, we project data points 


 -->