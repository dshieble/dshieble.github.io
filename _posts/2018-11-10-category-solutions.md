---
layout: post
title: My solutions to Bartosz Milewski's "Category Theory for Programmers"
tags: [Category Theory, Functional Programming, Mathematics, Solutions]
---
<script> 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-82391879-1', 'auto');
  ga('send', 'pageview');

</script>

I recently worked through Bartosz Milewski's excellent free book "Category Theory for Programmers." The book is available online [here](https://github.com/hmemcpy/milewski-ctfp-pdf/) and [here](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/).

I had an awesome time reading the book and learning about Category Theory so I figured I'd post my solutions to the book problems online to make it easier for other people to have a similar experience. You can find my solutions below: 


# Section 1
##### p1.1
##### Implement, as best as you can, the identity function in your favorite language (or the second favorite, if your favorite language happens to be Haskell).
*Solution*
```python
def identity(x):
  return x
```


##### p1.2
##### Implement the composition function in your favorite language. It takes two functions as arguments and returns a function that is their composition.
*Solution*
```python
def compose(f1, f2):
  return lambda x: f2(f1(x))
```


##### p1.3
##### Write a program that tries to test that your composition function respects identity.
*Solution*
```python
assert compose(lambda x: x + 4, identity)(5) == 9
assert compose(identity, lambda x: x + 4)(5) == 9
```

##### p1.4
##### Is the world-wide web a category in any sense? Are links morphisms?
*Solution*
The world wide web is indeed a category if we consider the objects to be webpages and for there to be an "arrow" between `A` and `B` if there is a way to get to `B` from `A` by clicking on links

##### p1.5
##### Is Facebook a category, with people as objects and friendships as morphisms?
*Solution*
No, because just because `A -> B` and `B -> C` does not imply `A -> C`

##### p1.6
##### When is a directed graph a category?
*Solution*
Whenever every node has an edge that points back to it and for every two nodes `A, B` such that there is a path from `A` to `B`, there is also an edge connecting `A` to `B`.

# Section 2
##### p2.1 Define a higher-order function (or a function object) `memoize` in your favorite language. This function takes a pure function `f` as an argument and returns a function that behaves almost exactly like `f`, except that it only calls the original function once for every argument, stores the result internally, and subsequently returns this stored result every time it’s called with the same argument. You can tell the memoized function from the original by watching its performance. For instance, try to memoize a function that takes a long time to evaluate. You’ll have to wait for the result the first time you call it, but on subsequent calls, with the sameargument, you should get the result immediately.
*Solution*
```python
def memoize(f):
  calls = {}
  def memoized(x):
    if x not in calls:
      calls[x] = f(x)
    return calls[x]
  return memoized
```

##### p2.2 Try to memoize a function from your standard library that you normally use to produce random numbers. Does it work?
*Solution*
This will not work

##### p2.3 Most random number generators can be initialized with a seed. Implement a function that takes a seed, calls the random number generator with that seed, and returns the result. Memoize that function. Does it work?
*Solution*
```python
def seed_to_random(seed):
  np.random.seed(seed)
  return np.random.random()
memoized_random = memoize(seed_to_random)

assert np.isclose(memoized_random(0), memoized_random(0))
assert memoized_random(0) != memoized_random(1)
```


##### p2.3 Which of these C++ functions are pure? Try to memoize them and observe what happens when you call them multiple times: memoized and not.
##### a: The factorial function from the example in the text.
*Solution*
`factorial` is a pure function

##### b: `std::getchar()`
*Solution*
`getchar` is not a pure function, since it relies on the state of `stdin`

##### c:
```cpp
bool f() {
    std::cout << "Hello!" << std::endl;
    return true;
}
```
*Solution*
`f` is not a pure function, since it has the side effect of printing
##### d:
```cpp
int f(int x) {
    static int y = 0;
    y += x;
    return y;
}
```
*Solution*
`f` is not a pure function, since it both has the side effect of incrementing `y` and relies on the state of static variable `y`

##### p2.5 How many different functions are there from `Bool` to `Bool`? Can you implement them all?
*Solution*
```haskell

same :: Bool -> Bool
same trueorfalse = trueorfalse

opposite :: Bool -> Bool
opposite trueorfalse = not trueorfalse

alwaystrue :: Bool -> Bool
alwaystrue _ = True

alwaysfalse :: Bool -> Bool
alwaysfalse _ = False
```

# Section 3

##### p3.1 Generate a free category from:
 *  **A graph with one node and no edges**
*Solution*
Add an identity arrow.

 *  **A graph with one node and one (directed) edge (hint: this edge can be composed with itself)**
*Solution*
Add infinite arrows to represent every number of applications of the directed edge.

 *  **A graph with two nodes and a single arrow between them**
*Solution*
Add identity arrows.

 *  **A graph with a single node and 26 arrows marked with the letters of the alphabet: a, b, c … z.**
*Solution*
Add an identity arrow, and then add infinite arrows, one for every combination of a-z of any length.



##### p3.2  What kind of order is this?
 *  **A set of sets with the inclusion relation: `A` is included in `B` if every element of `A` is also an element of `B`.**
 *Solution*
This is a partial order.
    * For any `(a, b)` there is at most one `a -> b` and if `a -> b` and `b -> a` then `a` and `b` have the same elements and are the same set.
    * Since there might be some `(a, b)` where `a intersect b` is empty, this is not a total order

 *  **C++ types with the following subtyping relation: `T1` is a subtype of `T2` if a pointer to `T1` can be passed to a function that expects a pointer to `T2` without triggering a compilation error.**
*Solution*
This is a partial order.
    * For any `(t1, t2)` there is at most one `t1 -> t2`, and if `t1 -> t2` and `t2 -> t1` then `t1` and `t2` are the same type.
    * There are types not connected by a subtype relation, so this is not a total order.

##### p3.3  Considering that `Bool` is a set of two values `True` and `False`, show that it forms two (set-theoretical) monoids with respect to, respectively,operator `AND` and `OR`.
*Solution*
**AND**
    * **Closure**: The output of `AND` is boolean
    * **Identity**: The identity is `True`
    * **Associative**: Easy to show by enumeration

**OR**
    * **Closure**: The output of `OR` is boolean
    * **Identity**: The identity is `False`
    * **Associative**: Easy to show by enumeration

##### p3.4  Represent the `Bool` monoid with the `AND` operator as a category: List the morphisms and their rules of composition.
*Solution*
The single element in this category is the `Bool` type. The morphisms are `AND True` (identity) and `AND False`. The composition of these two is `AND False`.

##### p3.5  Represent addition modulo 3 as a monoid category.
*Solution*
The single element in this category is the the type `[Int < 3, >= 0]`.
The morphisms are
    * A: add `3n` (identity)
    * B: add `1 + 3n`
    * C: add `2 + 3n`
The morphisms in this category are closed under association because `B . B` is `C` and both `B . C`, `C . B` are `A`

# Section 4
##### p4.1 Construct the Kleisli category for partial functions (define composition and identity).
*Solution*
```python
class Optional:

  def __init__(self, value):
    self._value = value

  def is_valid(self):
    return self._value is not None

  def get(self):
    assert self.is_valid()
    return self._value

def compose(f1, f2):
  def composed(x):
    f1out = f1(x)
    return f2(f1out.get()) if f1out.is_valid() else Optional(None)
  return composed

def identity(x):
  return Optional(x)
```


##### p4.2 Implement the embellished function `safe_reciprocal` that returns a valid reciprocal of its argument, if it’s different from zero.
*Solution*
```python
def safe_root(x):
  return Optional(np.sqrt(x)) if x >= 0 else Optional(None)

def safe_reciprocal(x):
  return Optional(1 / float(x)) if x != 0 else Optional(None)

assert not safe_root(-1).is_valid()
assert np.isclose(safe_root(4).get(), 2.0)

assert not safe_reciprocal(0).is_valid()
assert np.isclose(safe_reciprocal(4).get(), 0.25)

```


##### p4.3 Compose `safe_root` and `safe_reciprocal` to implement `safe_root_reciprocal` that calculates `sqrt(1/x)` whenever possible.
*Solution*
```python
safe_root_reciprocal = compose(safe_reciprocal, safe_root)

assert not safe_root_reciprocal(0).is_valid()
assert not safe_root_reciprocal(-5).is_valid()
assert np.isclose(safe_root_reciprocal(0.25).get(), 2)

```


# Section 5


##### p5.1 Show that the terminal object is unique up to unique isomorphism.
*Solution*
Consider two terminal objects `A, B`. There is exactly one morphism `m1` from `A -> B` since `B` is terminal and exactly one morphism `m2` from `B -> A` since `A` is terminal. Then `m1 . m2` is a morphism from `B -> B` and `m2 . m1` is a morphism from `A -> A`. Since `B` is terminal, there is exactly one morphism from `B -> B`, so `m1 . m2` is the identity.

Therefore `m1, m2` form an isomorphism between `A` and `B`. Since there are no other morphisms between `A` and `B`, `m1, m2` is a unique isomorphism.


##### p5.2 What is a product of two objects in a poset? Hint: Use the universal construction.
*Solution*
The product of two objects `A, B` in a poset is the object `C` that is less than both `A` and `B` (i.e. exists: `p: C -> A` and `q: C -> B`) and for any other object `D` that is also less than `A` and `B`, exists `D -> C`. This object does not always exist.

**Sufficiency**
Say we have such an `A, B, C`. Now consider some object `D` such that `p2: D -> A`, `q2: D -> B`. Then we have some `m: D -> C` so `p1 . m: D -> A` and `q1 . m: D -> B`. Now since there is at most one morphism between any pair of objects in a poset, it's true that `p2 = p1 . m` and `q2 = q1 . m`, so `m` factorizes `p` and `q`.

**Necessity**
If there were some object `D` such that `D -> A`, `D -> B` but not `D -> C`, then there is no morphism `m` such that `p1 = p2 . m` since `m` must be a morphism from `D -> C`. Therefore `C` is not the product of `A,B`.

##### p5.3 What is a coproduct of two objects in a poset?
*Solution*
We just reverse the arrows in **p5.2**. The coproduct of two objects `A, B` in a poset is the object `C` that is greater than both `A` and `B` (i.e. exists: `p: A -> C` and `q: B -> C`) and for any other object `D` that is also greater than `A` and `B`, exists `C -> D`.  This object does not always exist.

##### p5.4 Implement the equivalent of Haskell `Either` as a generic type in your favorite language (other than Haskell).
*Solution*
```python

class EitherAbstract(object):
  pass

class RightEither(EitherAbstract):
  def __init__(self, right):
    self.right = right

class LeftEither(EitherAbstract):
  def __init__(self, left):
    self.left = left

# doing something like this in python is a recipe for disaster :)
def either_factory(left_type, right_type):
  def generate(left=None, right=None):
    assert ((left is None) ^ (right is None))
    if left is not None:
      assert isinstance(left, left_type)
      out = LeftEither(left=left)
    if right is not None:
      assert isinstance(right, right_type)
      out = RightEither(right=right)
    return out
  return generate

my_left = either_factory(int, str)(left=5)
assert my_left.left == 5


my_right = either_factory(int, str)(right="5")
assert(my_right.right == "5")

try:
  either_factory(int, str)()
  print("failed")
except AssertionError:
  pass

try:
  either_factory(int, str)(left=5, right="5")
  print("failed")
except AssertionError:
  pass
 ```

##### p5.5 Show that `Either` is a "better" coproduct than `int` equipped with two injections:
```cpp
int i(int n) { return n; }
int j(bool b) { return b? 0: 1; }
```
**Hint: Define a function `int m(Either const & e);` that factorizes `i` and `j`.**
*Solution*
```python
# Consider the following injections from int and bool into int
def int_to_int(int_param):
  assert isinstance(int_param, int)
  return int_param

def bool_to_int(bool_param):
  assert isinstance(bool_param, bool)
  return 1 if bool_param else 0

# We can define the following morphism from Either into int
def either_to_int(either_param):
  isinstance(either_param, EitherAbstract)
  if either_param.kind == "left":
    out = int_to_int(either_param.left)
  elif either_param.kind == "right":
    out = bool_to_int(either_param.right)
  return out

"""
Then
bool_to_int(x) = either_to_int (either_factory(int, bool)(left=x))
int_to_int(y) = either_to_int (either_factory(int, bool)(right=y))
so either_to_int factorizes bool_to_int and int_to_int
"""
assert either_to_int(either_factory(int, bool)(left=5)) == int_to_int(5)
assert either_to_int(either_factory(int, bool)(right=True)) == bool_to_int(True)
assert either_to_int(either_factory(int, bool)(right=False)) == bool_to_int(False)
```


##### p5.6 Continuing the previous problem: How would you argue that `int` with the two injections` i` and `j` cannot be "better" than `Either`?
*Solution*
Say there exists some function `impossible_m` such that
```python
either_factory(int, bool)(left=x) = impossible_m ( int_to_int (x))
either_factory(int, bool)(right=y) = impossible_m ( bool_to_int (y))
```
For all `int x` and `bool y`. Then it must be the case that:
```python
impossible_m(1) = LeftEither(left=1)
impossible_m(1) = RightEither(right=1)
```
Which is not possible, because the output of a function for a given input argument must be unique.

##### p5.7 Still continuing: What about these injections?
```cpp
int i(int n) {
    if (n < 0) return n;
    return n + 2;
}
int j(bool b) { return b? 0: 1; }
```
*Solution*
Say there exists some function `new_m` such that

```python
def int_to_int_2(int_param):
  assert isinstance(int_param, int)
  return int_param if int_param < 0 else int_param + 2

either_factory(int, bool)(left=x) = new_m ( int_to_int_2 (x))
```

Then it must be the case that
```python
new_m(-x) = LeftEither(-x) for all x
new_m(2) = LeftEither(0)
new_m(3) = LeftEither(1)
new_m(4) = LeftEither(2)
...
new_m(max_int) = Left(max_int - 2)
```
Since there are only a finite number of integers in python/C++, `Left(max_int - 1)` and `Left(max_int)` cannot be in the domain of `new_m`.

##### p5.8 Come up with an inferior candidate for a coproduct of `int` and `bool` that cannot be better than `Either` because it allows multiple acceptable morphisms from it to `Either`
*Solution*

Consider some type `SuperEither` defined as
```haskell
data SuperEither = IntBoolTuple (Int, Int) | BoolBoolTuple (Bool, Bool)
```

We can define injections into this type from `int` and `bool` of the forms
```haskell
intint :: Int -> SuperEither;
intint x = IntIntTuple (x, x)

boolbool :: Bool -> SuperEither;
boolbool x = BoolBoolTuple (x, x)
```

Then we can define multiple morphisms from `SuperEither` into `Either` that take either the first or second element.


# Section 6

##### p6.1 Show the isomorphism between `Maybe a` and `Either () a`.
*Solution*
We can define the following two functions, which serve as inverses

```haskell
maybeToEither :: Maybe a -> Either () a
maybeToEither inputMaybe =
  case inputMaybe of
    Just a -> Right a
    Nothing -> Left ()

eitherToMaybe :: Either () a -> Maybe a
eitherToMaybe inputEither =
  case inputEither of
    Right a -> Just a
    Left () -> Nothing
```

##### p6.2 Here’s a sum type defined in Haskell:
```haskell
data Shape = Circle Float
    | Rect Float Float
```
##### When we want to define a function like area that acts on a `Shape`, we do it by pattern matching on the two constructors:
```haskell
area :: Shape -> Float
area (Circle r) = pi * r * r
area (Rect d h) = d * h
```
##### Implement `Shape` in C++ or Java as an interface and create two classes: `Circle` and `Rect`. Implement area as a virtual function.
*Solution*
```python
# I'll use python again, just for fun

class AbstractShape(object):

  def area(self):
    assert NotImplementedError()

  def circ(self):
    assert NotImplementedError()


class Circle(AbstractShape):

  def __init__(self, radius):
    self.radius = radius

  def area(self):
    return self.radius**2 * np.pi

  def circ(self):
    return 2 * self.radius * np.pi


class Rect(AbstractShape):

  def __init__(self, height, width):
    self.height = height
    self.width = width

  def area(self):
    return self.height * self.width

  def circ(self):
    return 2 * self.height + 2 * self.width

rect = Rect(3, 5)
assert rect.circ() == 16
assert rect.area() == 15
```


##### p6.3 Continuing with the previous example: We can easily add a new function `circ` that calculates the circumference of a `Shape`. We can do it without touching the definition of `Shape`:
```haskell
circ :: Shape -> Float
circ (Circle r) = 2.0 * pi * r
circ (Rect d h) = 2.0 * (d + h)
```
##### Add `circ` to your C++ or Java implementation. What parts of the original code did you have to touch?
*Solution*
See above. We needed to add it to each class, including `AbstractShape`.


##### p6.4 Continuing further: Add a new shape, `Square`, to `Shape` and make all the necessary updates. What code did you have to touch in Haskell vs. C++ or Java? (Even if you’re not a Haskell programmer, the modifications should be pretty obvious.)
*Solution*
For haskell we need to update the `Shape` definition and add another line to `circ` and `area` implementations. For python we needed to write a new class with a new initializer, inheriting from `Rect`

Haskell:
```haskell
data Shape = Circle Float | Rect Float Float | Square Float

area :: Shape -> Float
area (Circle r) = pi * r * r
area (Rect d h) = d * h
area (Square h) = h * h

circ :: Shape -> Float
circ (Circle r) = 2.0 * pi * r
circ (Rect d h) = 2.0 * (d + h)
circ (Square h) = 4.0 * h
```

Python:
```python
class Square(Rect):

  def __init__(self, length):
    self.height = length
    self.width = length


square = Square(5)
assert square.circ() == 20
assert square.area() == 25
```


##### p6.5 Show that `a + a = 2 * a` holds for types (up to isomorphism). Remember that `2` corresponds to `Bool`, according to our translation table.
*Solution*
`a + a` is equivalent to `Either a a` and `2 * a` is equivalent to `(Bool, a)`. We can define the following invertible functions between them.

```haskell
aPlusAToTwoTimesA :: Either a a -> (Bool, a)
aPlusAToTwoTimesA eitherAA =
  case eitherAA of
    Left a -> (True, a)
    Right a -> (False, a)

twoTimesAToAPlusA :: (Bool, a) -> Either a a
twoTimesAToAPlusA twoTimesA =
  case twoTimesA of
    (True, a) -> Left a
    (False, a) -> Right a
```
# Section 7: Functors

##### p7.1 Can we turn the `Maybe` type constructor into a functor by defining: `fmap _ _ = Nothing` which ignores both of its arguments? (Hint: Check the functor laws.)
*Solution*
No, this mapping of morphisms does not preserve the identity. For some `Just a`, we see that:
```haskell
(fmap id) Just a = Nothing
id Just a = Just a
```

##### p7.2 Prove functor laws for the `reader` functor. Hint: it’s really simple.
*Solution*
We need to use equational reasoning to prove that fmap maintains identity and preserves composition

**Identity**
```
fmap id (a->b) =
    (.) id (a->b) =
    id (a->b)
```

**Composition**
```
fmap ((c->d) . (b->c)) (a->b) =
  (c->d) . (b->c) . (a->b) =
  (c->d) . fmap ((b->c) (a->b)) =
  fmap (c->d) (fmap (b->c) (a->b))
```


##### p7.3 Implement the `reader` functor in your second favorite language (the first being Haskell, of course).
*Solution*
```python
def reader_functor_fmap(f, r_to_a):
  return lambda r: f(r_to_a(r))

def r_to_0(r):
  return 0

def r_to_1(r):
  return 1

r_to_5 = reader_functor_fmap(lambda x: x + 5, r_to_0)

assert r_to_0("r") == 0
assert r_to_1("r") == 1
assert r_to_5("r") == 5
```

##### p7.4 Prove the functor laws for the `list` functor. Assume that the laws are true for the tail part of the `list` you’re applying it to (in other words, use induction).
*Solution*

**Base Case**
  * **Identity**
    ```
    fmap id Nil = Nil = id Nil
    ```
  * **Composition**
     ```
    fmap (f . g) Nil = Nil = fmap f (Nil) = fmap f (fmap g Nil)
    ```

**Inductive Step**
  * **Identity**
    ```
    fmap id (Cons x t) =
        Cons (id x) (fmap id t)) =
        Cons (id x) (id t)) =
        Cons (x t) =
        id Cons (x t)
    ```
  * **Composition**
    ```
    fmap (f . g) (Cons x t)
        = Cons ((f . g) x) (fmap (f . g) t))  // definition of fmap
        = Cons ((f . g) x) ((fmap f . fmap g) t) // induction
        = fmap f (Cons (g x) (fmap g t)) // definition of fmap
        = fmap f (fmap g (Cons (x t))) // definition of fmap
        = (fmap f . fmap g) (Cons (x t))
    ```


# Section 8: Functorality

##### p8.1 Show that the data type: `data Pair a b = Pair a b` is a bifunctor. For additional credit implement all three methods of `Bifunctor` and use equational reasoning to show that these definitions are compatible with the default implementations whenever they can be applied.
*Solution*
Say we keep one of the arguments constant, then the fmap for both sides is just:
```haskell
fmap f Pair (a), (C) = Pair (f a) (C)
```
**Identity**
```haskell
fmap id Pair a C = Pair id a C = Pair a C
```
**Composition**
```haskell
fmap f*g Pair a C = Pair f*g(a) C = fmap f Pair g(a) C  = fmap f fmap g Pair a c
```

The three methods of Bifunctor
```haskell
data Pair a b = Pair a b
pairBimap :: (a -> c) -> (b -> d) -> Pair a b -> Pair c d
pairBimap g h (Pair a b) = Pair (g a) (h b)

pairFirst :: (a -> c) -> Pair a b -> Pair c b
pairFirst g (Pair a b) = Pair (g a) b

pairSecond :: (b -> d) -> Pair a b -> Pair a d
pairSecond f (Pair a b) = Pair a (f b)
```

Proof that these definitions are compatible with the default implementations whenever they can be applied.

Proof of `pairBimap`
```
(pairBimap g h) (Pair a b) =
  Pair (g a) (h b) // definition of pairBimap
  pairFirst g (Pair a (h b)) // definition of pairFirst
  (pairFirst g . pairSecond h) (Pair a b) // definition of pairSecond
```
Which means that
```
pairBimap g h = pairFirst g . pairSecond h
```

Proof of `pairFirst`
```
pairFirst g (Pair a b) =
  Pair (g a) b // definition of pairFirst
  Pair (g a) (id b) // definition of id
  pairBimap (g id) Pair a b // definition of pairBimap
```
Which means that
```
pairFirst g = pairBimap g id
```


Proof of `pairSecond`
```
pairSecond f (Pair a b) =
  Pair a (f b) // definition of pairSecond
  Pair (id a) (f b) // definition of id
  pairBimap (id f) Pair a b // definition of pairBimap
```
Which means that
```
pairSecond = pairBimap id
```


##### p8.2 Show the isomorphism between the standard definition of `Maybe` and this desugaring: `type Maybe' a = Either (Const () a) (Identity a)` Hint: Define two mappings between the two implementations. For additional credit, show that they are the inverse of each other using equational reasoning.
*Solution*

```haskell
data MyIdentity a = MyIdentity a
data MyConst c a = MyConst c
type Maybe' a = Either (MyConst () a) (MyIdentity a)

desugaredToMaybe :: Maybe' a -> Maybe a
desugaredToMaybe (Left (MyConst ())) =  Nothing
desugaredToMaybe (Right (MyIdentity a)) =  Just a

maybeToDesugared :: Maybe a -> Maybe' a
maybeToDesugared Nothing = Left (MyConst ())
maybeToDesugared (Just a) = Right (MyIdentity a)
```

We show that they are the inverse of each other using equational reasoning

```
maybeToDesugared desugaredToMaybe (Left (MyConst ()))
  = maybeToDesugared Nothing
  = maybeToDesugared Left (MyConst ())

desugaredToMaybe maybeToDesugared Nothing
  = desugaredToMaybe (Left (MyConst ()))
  = Nothing

maybeToDesugared desugaredToMaybe (Right (MyIdentity a))
  = maybeToDesugared Just a
  = Right (MyIdentity a)

desugaredToMaybe maybeToDesugared Just a
  = desugaredToMaybe Right (MyIdentity a)
  = Just a
```

##### p8.3 Let’s try another data structure. I call it a `PreList` because it’s a precursor to a List. It replaces recursion with a type parameter `b`: `data PreList a b = Nil | Cons a b`. You could recover our earlier definition of a `List` by recursively applying `PreList` to itself (we’ll see how it’s done when we talk about fixed points). Show that `PreList` is an instance of `Bifunctor`.
*Solution*
Lets form the following mapping

```haskell
fmapFull:: (a -> c) -> (b -> d) -> (PreList a b) -> (PreList c d)
fmapFull f g Nil = Nil
fmapFull f g Cons a b = Cons (f a) (g b)
```

Say we keep `b` constant (WLOG). Then the `fmap` for `a` is
```haskell
fmap f Nil = Nil
fmap f Cons a C = Cons (f a) C
```
This is a functor because
**Identity**
```
fmap id Nil = Nil
fmap id Cons a C = Cons id a C = Cons a C
```
**Composition**
```
fmap f . g Nil = Nil
fmap f . g Cons a C =
    Cons f . g a C =
    fmap f Cons g a C =
    fmap f (fmap g Cons a C)
```





##### p8.4 Show that the following data types define bifunctors in `a` and `b`:
```haskell
data K2 c a b = K2 c
data Fst a b = Fst a
data Snd a b = Snd b
```
##### For additional credit, check your solutions agains Conor McBride’s paper Clowns to the Left of me, Jokers to the Right.
*Solution*

`K2`:
Without loss of generality, if we hold `b` constant, then `K2` becomes `Const`, which is a functor

`Fst`:
If we hold `a` constant, then `Fst` becomes `Const`, which is a functor
If we hold `b` constant, then `Fst` becomes `Identity`, which is a functor

`Snd`:
If we hold `a` constant, then `Snd` becomes `Identity`, which is a functor
If we hold `b` constant, then `Snd` becomes `Const`, which is a functor



##### p8.5 Define a bifunctor in a language other than Haskell. Implement `bimap` for a generic pair in that language.
*Solution*
```python
class Bifunctor(object):

  def apply_bimap(self, f, g):
    assert False

  @classmethod
  def first(cls, f):
    return lambda pair: pair.apply_bimap(f, lambda x: x)

  @classmethod
  def second(cls, g):
    return lambda pair: pair.apply_bimap(lambda x: x, g)

  @classmethod
  def bimap(cls, f, g):
    return lambda pair: pair.apply_bimap(f, g)


class Pair(Bifunctor):

  def __init__(self, aval, bval):
    self.aval = aval
    self.bval = bval

  def apply_bimap(self, f, g):
    return Pair(f(self.aval), g(self.bval))


p = Pair(5, "4")
first_mapped = Bifunctor.first(lambda x: x + 1)(p)
assert first_mapped.aval == 6
assert first_mapped.bval == "4"

second_mapped = Bifunctor.second(lambda x: x + "1")(p)
assert second_mapped.aval == 5
assert second_mapped.bval == "41"

bimapped = Bifunctor.bimap(lambda x: x + 1, lambda s: s + "1")(p)
assert bimapped.aval
```

##### p8.6 Should `std::map` be considered a bifunctor or a profunctor in the two template arguments `Key` and `T`? How would you redesign this data type to make it so?
*Solution*
`std::map` should be considered a profunctor in `Key` and `T`.

We can define it as a Profunctor as follows:
```haskell
get :: a -> Maybe b

instance Profunctor get where
  dimap f g get = lmap f . rmap g
  lmap f get = \x -> get (f x)
  rmap g get = \x -> fmap g (get x)
```


# Section 9: Function Types (No Challenges)
# Section 10: Natural Transformations

##### p10.1 Define a natural transformation from the `Maybe` functor to the `list` functor. Prove the naturality condition for it.
*Solution*
```haskell
natTrans:: Maybe a -> [a]
natTrans (Just x) = [x]
natTrans Nothing = []
```

The naturality condition is `G f ◦ αa = αb ◦ F f`, which translates to  `fmap_list f . natTrans = natTrans . fmap_maybe f`

`Nothing` Case:
```
fmap_list f . natTrans Nothing =
  fmap_list f [] =
  [] =
  natTrans Nothing =
  natTrans . fmap_maybe f Nothing
```

`(Just x)` Case:
```
fmap_list f . natTrans (Just x) =
  fmap_list f [x] =
  [f(x)] =
  natTrans (Just (f x)) =  
  natTrans . fmap_maybe f (Just x)
```




##### p10.2 Define at least two different natural transformations between `Reader ()` and the `list` functor. How many different lists of `()` are there?
*Solution*

```haskell
natTransRL1:: (() -> a) -> [a]
natTransRL1 _ = []

natTransRL2:: (() -> a) -> [a]
natTransRL2 g = [g ()]

natTransRL3:: (() -> a) -> [a]
natTransRL3 g = fmap g [(), ()]
````

Since there are an infinite number of lists of `[(), ...]`, there are an infinite number of these natural transformations.


##### p10.3 Continue the previous exercise with `Reader Bool` and `Maybe`.
*Solution*

There are three natural transformations from `Reader Bool -> Maybe`
```haskell
natTransRB1:: (Bool -> a) -> Maybe a
natTransRB1 _ = Nothing

natTransRB2:: (Bool -> a) -> Maybe a
natTransRB2 g = Just (g True)

natTransRB3:: (Bool -> a) -> Maybe a
natTransRB3 g = Just (g False)
```


##### p10.4 Show that horizontal composition of natural transformation satisfies the naturality condition (hint: use components). It’s a good exercise in diagram chasing.
*Solution*

We have the functors `F, G` and the natural transformations:
```
αa:: F a -> F'a
βa:: G a -> G'a
```

We need to show that `(G' . F') f . (β ◦ α)a = (β ◦ α)b . (G . F) f`
```
(β ◦ α)b . (G . F) f =
  (βF'b . Gαb) . G . F f = // definition of horizontal composition
   βF'b . G  . F' f . αa = // G αb :: G (F b) -> G (F'b)
  (G' . F') f . (β ◦ α)a = // βF'b :: G (F'a) -> G'(F'a)
```

##### p10.5 Write a short essay about how you may enjoy writing down the evident diagrams needed to prove the interchange law.
*Solution*

If it's the case that:
```
F -β'-> F'
F' -α'-> F''

G -β-> G'
G' -α-> G''
```
Then by the definition of horizontal composition it's simple to see that:
```
FG -(β' ◦ β)-> F'G' -(α' ◦ α)-> F''G''
FG -(β' . α') ◦ (β . α)-> F''G''
```
Also, by horizontal composition:
```
FG -(β' ◦ β)-> F'G'
F'G' -(α' ◦ α)-> F''G''
FG -(β' ◦ β) . (α' ◦ α)-> F''G''
```
so `(β' ◦ β) . (α' ◦ α)` and `(β' . α') ◦ (β . α)` have the equivalent effect on `FG`

##### p10.6 Create a few test cases for the opposite naturality condition of transformations between different `Op` functors. Here’s one choice:
```haskell
op :: Op Bool Int
op = Op (\x -> x > 0)
and
f :: String -> Int
f x = read x
```
*Solution*
```haskell
newtype Op r a = Op (a -> r)
contramap f (Op g) = Op (g . f)

unwrap_op :: Op a b -> b -> a
unwrap_op (Op f) x = f x

-- test 1
op1 :: Op Bool Int
op1 = Op (\x -> (x > 0))

f1 :: Bool -> Int
f1 x = if x then 1 else 0

opBoolToOpChar :: Op Bool a -> Op Char a
opBoolToOpChar (Op aToBool) = Op (\x -> if aToBool x then 'a' else 'b')

boolchar_contra_f_op1 :: Op Char Bool
boolchar_contra_f_op1 = opBoolToOpChar ((contramap f1) op1)

contra_f_boolchar_op1 :: Op Char Bool
contra_f_boolchar_op1 = contramap f1 (opBoolToOpChar op1)

test1a = (unwrap_op boolchar_contra_f_op1 True) == (unwrap_op contra_f_boolchar_op1 True)
test1b = (unwrap_op boolchar_contra_f_op1 False) == (unwrap_op contra_f_boolchar_op1 False)

-- test 2
op2 :: Op String Double
op2 = Op (\x -> show x)

f2 :: Int -> Double
f2 x = sqrt (fromIntegral x)

opStringToOpInt :: Op String a -> Op Int a
opStringToOpInt (Op aToString) = Op (\x -> length (aToString x))

stringint_contra_f_op2 :: Op Int Int
stringint_contra_f_op2 = opStringToOpInt ((contramap f2) op2)

contra_f_stringint_op2 :: Op Int Int
contra_f_stringint_op2 = contramap f2 (opStringToOpInt op2)

test2a = (unwrap_op stringint_contra_f_op2 5) == (unwrap_op contra_f_stringint_op2 5)
test2b = (unwrap_op stringint_contra_f_op2 2) == (unwrap_op contra_f_stringint_op2 2)
```

# Section 11: Declarative Programming (No Challenges)

# Section 12: Limits and Colimits

##### p12.1 How would you describe a pushout in the category of C++ classes?
*Solution*
We are working in the C++ types category with subclasses as morphisms. For the span `1 <- 2 -> 3` we have a class 2 that inherits from 1 and 3, and since we are working with colimits, the apex is some 4 such that `1 -> 4 <- 3`. The pushout is the colimit of this diagram, which is the universal 4 such that the colimit is also the subclass of every other candidate. This is the class 4 that has the maximum amount of shared functionality such that it can still be a superclass of 1 and 3.


##### p12.2 Show that the limit of the identity functor `Id :: C -> C` is the initial object.
*Solution*
The identity functor forms diagrams consisting of every item in C. The apex of each diagram must have morphisms to every other item, and the limit object must have unique morphisms to every other limit candidate, which is every other item. Therefore the limit must be the initial object.

##### p12.3 Subsets of a given set form a category. A morphism in that category is defined to be an arrow connecting two sets if the first is the subset of the second. What is a pullback of two sets in such a category? What’s a pushout? What are the initial and terminal objects?
*Solution*
The pushout is the intersection of the two sets (the largest set contained in them both) and the pullback is the union of those sets (the smallest set that contains them both). The initial object is the empty set and the terminal object is the "given set" that contains all of the elements and that all of the other elements are subsets of.

##### p12.4 Can you guess what a coequalizer is?
*Solution*
The coequalizer is the equalizer in the opposite category. Given some 2 morphisms `f: b -> a` and `g: b -> a`, the coequalizer is the colimit object `c` and associated morphism `p: a -> c` such that `p . f = p . g`. That is, for any other `c'` with morphism `p'` there exists some `u` such that `p' = p . u`.

Over Set, the coequalizer defines a transformation of f and g's codomains that makes them equal to each other.

##### p12.5 Show that, in a category with a terminal object, a pullback towards the terminal object is a product.
*Solution*
Consider a diagram formed by the three object category `I` of the form `1 -f-> t <-g- 2` such that t is the terminal object. Since f and g are unique, the category of such diagrams is isomorphic to the category of diagrams formed by the two object discrete category consisting of only `1,2` without morphisms. The limit of this category is the product, so the pullback towards the terminal object is the product.


##### p12.6 Similarly, show that a pushout from an initial object (if one exists) is the coproduct.
*Solution*
Consider a diagram formed by the three object category I of the form `1 <-f- i -g-> 2` such that `i` is the initial object. Since `f` and `g` are unique, the category of such diagrams is isomorphic to the category of diagrams formed by the two object discrete category consisting of only `1,2` without morphisms. The colimit of this category is the coproduct, so the pushout towards the initial object is the coproduct.


# Section 13: Free Monoids

##### p13.1 You might think (as I did, originally) that the requirement that a homomorphism of monoids preserve the unit is redundant. After all, we know that for all `a`, `h a * h e = h (a * e) = h a` So `h e` acts like a right unit (and, by analogy, as a left unit). The problem is that `h a`, for all `a` might only cover a sub-monoid of the target monoid. There may be a "true" unit outside of the image of h. Show that an isomorphism between monoids that preserves multiplication must automatically preserve unit.
*Solution*
Say `f: A -> A'` is a monoid isomorphishm. Then there exists some `g: A' -> A` such that `g f a = a`. Given the unit `u` in `A`, for all `a'` in `A'`, we see `g (a' * f u) = g a' * g f u = g a' * u = g a'`. Since `g` is injective, this means that `a' = a' * f u`, so `f u` is the right unit for all `a' in A'`. We can do the same to show `f u` is the left unit as well.

##### p13.2 Consider a monoid homomorphism from lists of integers with concatenation to integers with multiplication. What is the image of the empty list `[]`? Assume that all singleton lists are mapped to the integers they contain, that is `[3]` is mapped to `3`, etc. What’s the image of `[1, 2, 3, 4]`? How many different lists map to the integer 12? Is there any other homomorphism between the two monoids?
*Solution*
The image of the empty list is `1`, and the image of `[1,2,3,4]` is `1*2*3*4=24`. The lists `[12,1] [1,12] [6,2] [2,6] [3,4] [4,3] [2,2,3] [2,3,2] [3,2,2]` all map to `12`.

The function that maps all lists of integers to `1` is also a homomorphism, because the unit `[1]` is preserved and for any two lists `l1,l2` we see that `h (l1 ++ l2) = 1 = 1 * 1 = h l1 * h l2`



##### p13.3 What is the free monoid generated by a one-element set? Can you see what it’s isomorphic to?
*Solution*
This monoid is lists of unit `()` with concatenation. This is isomorphic to integers over addition.

```haskell
forward :: List () -> Int
forward x = length x

inverse :: Int -> List ()
inverse x = replicate x [()]
```


# Section 14: Representable Functors

##### p14.1 Show that the hom-functors map identity morphisms in `C` to corresponding identity functions in `Set`.
*Solution*
When we apply the functor `C(a, -)` to some function `f`, we get a function that performs the action `C (a, f) h = f . h` on any morphism `h: a -> x` in the homset `Hom(a, x)`. If `f: x -> x` is the identity morphism, `f . h = h`, so `C (a, f) h = h`, and `C (a, f)` is the identity morphism as well.

##### p14.2 Show that `Maybe` is not representable.
*Solution*
If Maybe were representable, then we would be able to implement a function of the for `beta :: Maybe x -> (a -> x)`. However, it is not possible to implement a function that accepts `None` and return `a -> x` for any arbitrary `x` type.

##### p14.3 Is the `Reader` functor representable?
*Solution*
Yes, the `Reader` functor is the hom-functor over haskell types and it is isomorphic to itself.

##### p14.4 Using `Stream` representation, memoize a function that squares its argument.
*Solution*
```haskell
data Stream x = Cons x (Stream x)
instance Representable Stream where
  type Rep Stream = Int
  tabulate f = Cons (f 0) (tabulate (f . (+1)))
  index (Cons b bs) n = if n == 0 then b else index bs (n - 1)

squareArg :: Int -> Int
squareArg x = x * x

memoizedSquares :: Stream Int
memoizedSquares = tabulate squareArg


zerothSquare :: Int
zerothSquare = index memoizedSquares 0
zerothSquareTrue = zerothSquare == 0

thirdSquare :: Int
thirdSquare = index memoizedSquares 3
thirdSquareTrue = thirdSquare == 9


fifthSquare :: Int
fifthSquare = index memoizedSquares 5
fifthSquareTrue = fifthSquare == 25
```

##### p14.5 Show that `tabulate` and `index` for `Stream` are indeed the inverse of each other. (Hint: use induction.)
*Solution*
We want to prove that for all `n`, `index tabulate f n = f n`
**Base Case**
```
index (tabulate f) 0 = // definition of tabulate
  index (Cons (f 0) (tabulate (f . (+1)))) 0 = // definition of index
  f 0
```
**Inductive Step**
```
index (tabulate f) n = // definition of tabulate
  index (Cons (f 0) (tabulate (f . (+1)))) n = // definition of index
  index (tabulate (f . (+1))) (n - 1)  = // inductive assumption
  f . (+1) . (n - 1) =
  f n
```

# Section 15: The Yoneda Lemma

##### p15.1 Show that the two functions `phi` and `psi` that form the Yoneda isomorphism in Haskell are inverses of each other.
```haskell
phi :: (forall x . (a -> x) -> F x) -> F a
phi alpha = alpha id
psi :: F a -> (forall x . (a -> x) -> F x)
psi fa h = fmap h fa
```
*Solution*
Note `psi` can be written as `psi fa = \h -> fmap h fa`
**Forward**
```
(phi . psi) fa =
  phi (\h -> fmap h fa) =
  (\h -> fmap h fa) id =
  fmap id fa =
  fa
```
**Backward**
```
(psi . phi) alpha =
  psi (alpha id) =
  \h -> fmap h (alpha id) =
  \h -> (alpha h id) =
  \h -> alpha h =
  alpha
  ```
##### p15.2 A discrete category is one that has objects but no morphisms other than identity morphisms. How does the Yoneda lemma work for functors from such a category?
*Solution*
Any homfunctor `C(a, -)` from the discrete category maps `a` to the singleton set and all other objects to the empty set. For any functor `F` from the discrete category to `Set`, there are `N` morphisms (the item-selection morphisms) between the singleton set and `F a`, where `N` is the number of elements of `F a`. Since there is one morphism from the empty set to each other set, each of those N morphisms from singleton to `F a` indicate a unique natural transformation from `C(a, -)` to `F`, so there is one-to-one correspondence between these natural transformations and elements of `F a`.


##### p15.3 A list of units `[()]` contains no other information but its length. So, as a data type, it can be considered an encoding of integers. An empty list encodes zero, a singleton `[()]` (a value, not a type) encodes one, and so on. Construct another representation of this data type using the Yoneda lemma for the `list` functor.
*Solution*
By the Yoneda lemma, the natural transformations from `C(a, -)` (in this case `() -> x`) to `F` (in this case `List x`) are one-to-one with the elements of `F a`. So the data type `D (() -> x) -> List x` is another representation of `List ()`.

It's pretty easy to see why this is the case - a function of the form `f: () -> x` is essentially a container for a single value of `x`. So the elements of `D` are all of the form:
```
d1 f = [f ()]
d2 f = [f (), f ()]
...
```

# Section 16: Yoneda Embedding

##### p16.1 Express the co-Yoneda embedding in Haskell.
*Solution*
```haskell
forward :: (a -> b) -> ((x -> a) -> (x -> b))
forward atob = \f -> atob . f

backward :: ((x -> a) -> (x -> b)) -> (a -> b)
backward xToAToXToB = \a -> (xToAToXToB id) a
```

##### p16.3 Work out the Yoneda embedding for a monoid. What functor corresponds to the monoid’s single object? What natural transformations correspond to monoid morphisms?
*Solution*
In the single-element category view of monoid, we have a single element and the morphisms follow the monoid association rules. We will call this category `M`.
The Yoneda embedding maps the single object `a` to the functor `M(a, -)`, which is the functor in `[M, Set]` that maps the single element `a` to the set `M(a,a)`.
The Yoneda embedding maps each morphism in `M` to the identity natural transformation that maps the functor `M(a, -)` to itself.

##### p16.4 What is the application of the covariant Yoneda embedding to preorders? (Question suggested by Gershom Bazerman.)
In a preorder category `C`, if and only if a morphism  `f: b -> a` exists, we have exactly one natural transformation between `C(a, -)` and `C(b, -)`. Since there are no functions that map non-empty sets into the empty set, we see that if `C(a, x)` is nonempty, then `C(b, x)` must be nonempty as well.

Therefore, we have the condition: `b <= a`, if and only if for all `x`, `a <= x` implies `b <= x`


##### p16.5 Yoneda embedding can be used to embed an arbitrary functor category `[C, D]` in the functor category `[[C, D], Set]`. Figure out how it works on morphisms (which in this case are natural transformations).
*Solution*
For any natural transformation `NatAB` between the functors `Fb: C -> D` and `Fa: C -> D` such that `NatAB: Fb -> Fa`, the Yoneda embedding maps it to the natural transformation:
```
NYoneda: [C, D](Fa, -) -> [C, D](Fb, -)
```
Where
```
[C, D](Fa, -): Fx -> NatAX
NatAX: Fa -> Fx
[C, D](Fb, -): Fx -> NatBX
NatBX: Fb -> Fx
```

`NYoneda` operates on `[C, D](Fa, -)` by post-composing `NatAB` to the natural transformations in the output `NatAX`, which maps the output set to `NatBX`, which maps `([C, D](Fa, -): Fx -> NatAX) -> ([C, D](Fb, -): Fx -> NatBX)`



# Section 17: It’s All About Morphisms

##### p17.1 Consider some degenerate cases of a naturality condition and draw the appropriate diagrams. For instance, what happens if either functor `F` or `G` map both objects `a` and `b` (the ends of `f :: a -> b`) to the same object, e.g., `F a = F b` or `G a = G b`? (Notice that you get a cone or a co-cone this way.) Then consider cases where either` F a = G a` or `F b = G b`. Finally, what if you start with a morphism that loops on itself — `f :: a -> a`?
*Solution*

For the following subproblems, let's assume we have some function `f: a->b` and natural transformation `α` between functors `F` and `G`.

###### p17.1.1
Say `Fa = Fb`. Then `Ga = Gb` because:
```
(α . Ff) Fa =
    α . Fb =
    α . Fa =
    Ga

(Gf * α) Fa =
    Gf Ga =
    Gb
```

###### p17.1.2
Say `Ga = Gb`. Then `αB Fb = αA Fa`, but we can't conclude that `Fb = Fa`, because it's possible that `G` is the constant functor.

###### p17.1.3

Say `Fa = Ga`. Then `Gf: Fa -> Gb` and since `αA Fa = Ga`, `αA` is the identity.

###### p17.1.4
Say `Fb = Gb`. Then `Ff: Fa -> Gb` and since `αB Fb = Gb`, `αB` is the identity.


###### p17.1.5
Say `f: a -> a`. Then `αA * Ff = Gf * αA`.

# Section 18: Adjunctions

##### p18.1 Derive the naturality square for `ψ`, the transformation between the two (contravariant) functors:
```
a -> C(L a, b)
a -> D(a, R b)
```
*Solution*
Say we have
```
f  :: a1 -> a2
F f :: C(L a1, b) -> C(L a2, b)
G f :: D(a1, R b) -> D(a2, R b)
```
Where `L` and `R` are functors
```
L :: D(a, R b) -> C(L a, b)
R :: C(L a, b) -> D(a, R b)
```

and define the natural transformation `ψ: G -> F` such that
```
ψg1 :: D(a1, R b) -> C(L a1, b)
ψg2 :: D(a2, R b) -> C(L a2, b)
```

Now consider the morphisms `g1: a1 -> R` and `g2: a2 -> R b`. We want to prove that `F f * ψg1 = ψg2 * G f`

```
ψg2 * G f G a1 = // definition of f
  ψg2 * G a2 = // definition of G
  ψg2 * D(a2, R b) = // definition of ψg2
  C(L a2, b) = // definition of G
  F a2 = // definition of F
  F f * F a1 = // definition of f
  F f * ψg1 G a1  // definition of ψg1
```


##### p18.2 Derive the counit `ε` starting from the hom-sets isomorphism in the second definition of the adjunction.
*Solution*
Assume that `C(L d, c) ≅ D(d, R c)` holds for any `c` in `C` and `d` in `D`. We want to prove that there exists some natural transformation `ε :: L . R -> Ic`.

Say `d = R c`, then `C((L . R) c, c) ≅ D(R c, R c)`. Since `D(Rc, Rc)` contains at least the identity, our natural transformation from `D(R c, R c) -> C((L . R) c, I c)` must map to a non-empty set. Therefore, we have some set of morphisms that map from `(L . R) c -> I c` for any `c`. These morphisms form a natural transformation from `L * R -> Ic`, which is `ε`.




##### p18.3 Complete the proof of equivalence of the two definitions of the adjunction.
*Solution*
In order to prove that the two definitions are equivalent, we need to prove the equivalence of the isomorphism `C(L d, c) ≅ D(d, R c)` and the existence of two natural transformations: the unit `η` and the counit `ε`.

In the text we proved that `C(L d, c) ≅ D(d, R c)` implies the existence of the `η` and that the existence of the `η` and `ε` implies the existence of a mapping from `C(L d, c)` to `D(d, R c)`. In **p18.2**, we proved that `C(L d, c) ≅ D(d, R c)` implies the existence of the `ε`. Therefore, we still need to prove that the existence of the `η` and `ε` implies the existence of `ψ :: D(d, R c) -> C(L d, c)`

For some morphism  `f :: d -> R c`, we can apply `εc * L` to form the morphism:
```
εc . L f =
    L d -> εc L . R c =
    L d -> c =
    ψf
```

##### p18.4/5 Show that the coproduct can be defined by an adjunction. Start with the definition of the factorizer for a coproduct. Show that the coproduct is the left adjoint of the diagonal functor.
*Solution*
*(In this solution, we assume C is Set or Hask)*
We want to prove that `C(Either a b, c) ≅ (C × C)(<a, b>, Δ c)`. A homset in `CxC` is `(C×C)(<a, b>, Δ c)`, which consists of pairs of functions `a -> c, b -> c` and a homset in `C` is `C(Either a b, c)`, which consists of functions `(Either a b -> c)`

We can define a natural transformation between these two homsets with the `factorizer` and `inversefactorizer` functions.
```
factorizer :: (C×C)(<a, b>, Δ c) -> C(Either a b, c)
inversefactorizer :: C(Either a b, c) -> (C×C)(<a, b>, Δ c)
```

We can write these in pseudo-haskell as
```
factorizer :: ((a -> c), (b -> c)) -> (Either a b -> c)
factorizer (i,j) (Left a) = i a
factorizer (i,j) (Right b) = j b

inversefactorizer :: (Either a b -> c) -> ((a -> c), (b -> c))
inversefactorizer m = (\a -> m Left a), (\b -> m Right b)
```
Now note that because these are both polymorphic in `a,b,c`, both `factorizer` and `inversefactorizer` are natural, so `C(Either a b, c) ≅ (C × C)(<a, b>, Δ c)`.


##### p18.6 Define the adjunction between a product and a function object in Haskell.
*Solution*
```haskell
producttofunction :: ((z, a) -> b) -> (z -> (a -> b))
producttofunction f = \z -> (\a -> f (z,a))

functiontoproduct :: (z -> (a -> b)) -> ((z, a) -> b)
functiontoproduct f = \z_a -> ((f (fst z_a)) (snd z_a))
```

# Section 19: Free/Forgetful Adjunctions

##### p19.1 Consider a free monoid built from a singleton set as its generator. Show that there is a one-to-one correspondence between morphisms from this free monoid to any monoid `m`, and functions from the singleton set to the underlying set of m`.
*Solution*

**Forward**
Consider a morphism from the free monoid with the singleton set as its generator to `m`. This morphism maps the generator element `e` to some `m1` in `m`. There exists exactly one function in the homset between the singleton set and the underlying set of `m` that maps `()` to `m1`, so we can define a forward mapping.

**Backward**
Consider a function from the singleton set to the underlying set of `m`. This function "chooses" a single element `m1` from the underlying set of `m`. We can define exactly one homomorphism between the singleton free monoid and `m` that maps the generator element `e` to `m1`, since any such homomorphism must satisfy the following:
```
1 -> unit
e -> m1
ee -> m1m1
eee -> m1m1m1
```
so there is exactly one such homomorphism and we can define a backward mapping.
# Section 20: Monads: Programmer's Definition (No Challenges)

# Section 21: Monads and Effects (No Challenges)
# Section 22: Monads Categorically (No Challenges)
# Section 24: F-Algebras
##### p24.1 Implement the evaluation function for a ring of polynomials of one variable. You can represent a polynomial as a list of coefficients in front of powers of x. For instance, `4x^2-1` would be represented as (starting with the zero’th power) `[-1, 0, 4]`.
*Solution*
```haskell
polyEval :: [Double] -> Double -> Double
polyEval coefficients value = foldr (\ (power, coeff) sumSoFar -> sumSoFar + coeff * (value ** power)) 0.0 (zip [0..] coefficients)
isTrue = 99.0 ==  (polyEval [-1, 0, 4] 5)
```
##### p24.2 Generalize the previous construction to polynomials of many independent variables, like `x^2y-3y^3z`.
*Solution*
```haskell
raiseAndProd :: [Double] -> [Double] -> Double
raiseAndProd values powers  = foldr (\(value, power) prodSoFar -> prodSoFar * (value ** power)) 1.0 (zip values powers)

polyMultiEval :: [(Double, [Double])] -> [Double] -> Double
polyMultiEval coeffsExps values = foldr (\ (coeff, powers) sumSoFar -> sumSoFar + coeff * (raiseAndProd values powers)) 0.0 coeffsExps

isTrue1 = -2580.0 == (polyMultiEval [(1, [2, 1, 0]), (-3, [0, 3, 1])] [3, 5, 7]))
isTrue2 = 1.0 == (polyMultiEval [(1, [2, 1])] [1, 1])
```

##### p24.3 Implement the algebra for the ring of `2×2` matrices.
*Solution*
```haskell
data MatExpr = RZero
  | ROne
  | RCompA
  | RCompB
  | RCompC
  | RCompD
  | RAdd MatExpr MatExpr
  | RMul MatExpr MatExpr
  | RNeg MatExpr


type MatrixTwoTwo = (Double, Double, Double, Double)

mCompA :: MatrixTwoTwo
mCompA = (1, 0, 0, 0)

mCompB :: MatrixTwoTwo
mCompB = (0, 1, 0, 0)

mCompC :: MatrixTwoTwo
mCompC = (0, 0, 1, 0)

mCompD :: MatrixTwoTwo
mCompD = (0, 0, 0, 1)

mZero :: MatrixTwoTwo
mZero = (0, 0, 0, 0)

mEye :: MatrixTwoTwo
mEye = (1, 0, 1, 0)

mAdd :: MatrixTwoTwo -> MatrixTwoTwo -> MatrixTwoTwo
mAdd (a1,b1,c1,d1) (a2,b2,c2,d2) = (a1 + a2, b1 + b2, c1 + c2, d1 + d2)

mMult :: MatrixTwoTwo -> MatrixTwoTwo -> MatrixTwoTwo
mMult (a1,b1,c1,d1) (a2,b2,c2,d2) = (a1 * a2 + b1 * c2, a1 * b2 + b1 * d2, c1 * a2 + d1 * c2, c1 * b2 + d1 * d2)

mNeg :: MatrixTwoTwo -> MatrixTwoTwo
mNeg (a1,b1,c1,d1)  = (-a1,-b1,-c1,-d1)

evalZ :: MatExpr -> MatrixTwoTwo
evalZ RZero = mZero
evalZ ROne = mEye
evalZ RCompA = mCompA
evalZ RCompB = mCompB
evalZ RCompC = mCompC
evalZ RCompD = mCompD
evalZ (RAdd e1 e2) = mAdd (evalZ e1) (evalZ e2)
evalZ (RMul e1 e2) = mMult (evalZ e1) (evalZ e2)
evalZ (RNeg e) = mNeg (evalZ e)


matrixExpression :: MatExpr
matrixExpression = RMul (RAdd RCompA RCompB) (RAdd RCompC RCompD)
isTrue = (1.0, 1.0, 0.0, 0.0) == (evalZ matrixExpression))
```
##### p24.4 Define a coalgebra whose anamorphism produces a list of squares of natural numbers.
*Solution*
```haskell
newtype Fix f = Fix (f (Fix f))
unFix :: Fix f -> f (Fix f)
unFix (Fix x) = x

cata :: Functor f => (f a -> a) -> Fix f -> a
cata alg = alg . fmap (cata alg) . unFix

ana :: Functor f => (a -> f a) -> a -> Fix f
ana coalg = Fix . fmap (ana coalg) . coalg

data StreamF e a = StreamF e a deriving Functor

toListC :: Fix (StreamF e) -> [e]
toListC = cata al
  where al :: StreamF e [e] -> [e]
        al (StreamF e a) = e : a

nat :: [Int] -> StreamF Int [Int]
nat (p : ns) = StreamF (p^2) ns

squaresStream :: Fix (StreamF Int)
squaresStream = ana nat [0..]

squaresList :: [Int]
squaresList = toListC squaresStream
```
##### p24.5 Use `unfoldr` to generate a list of the first n primes.
*Solution*
```haskell
listSieve :: [Int] -> Maybe (Int, [Int])
listSieve (p : ns) = Just (p, (filter (notdiv p) ns))
  where notdiv p n = n `mod` p /= 0

primeFilteredList :: [Int]
primeFilteredList = unfoldr listSieve [2..]

isTrue1 = primeFilteredList!!0 == 2
isTrue2 = primeFilteredList!!3 == 7
```

# Section 25: Algebras for Monads

##### p25.1 What is the action of the free functor `F :: C -> C^T` on morphisms. Hint: use the naturality condition for monadic `μ`.
*Solution*
First, note that `F a = (T a, μa)`. Since `μ` is natural, we see that `T f . μa = μb . (T . T) f`.  Therefore, for some `f :: a -> b`, the action of `F` on `f` is:
```
fmap f (T a, μa) = (fmap f T a, T f . μa)
```

##### p25.2 Define the adjunction: `U^W ⊣ F^W`
*Solution*
First, we define the unit `η :: I -> F^W . U^W`. Since it's the case that
```
F^W . U^W (W a, f) =
    F^W (W a) =
    (W W a, δWa)
```
`η` needs to map `(W a, f) -> (W W a, δWa)`. We can accomplish this by using `f`, the co-evaluator of the co-algebra, to define the component of `η` at `(W a, f)`

Next, we define the co-unit `ε :: U^W . F^W -> I`. Since it's the case that:
```
U^W . F^W a =
    U^W . (W a, δa) =
    W a
```
`ε` needs to map `W a -> a` so we can use the `extract` method of the co-monad to define the component of `ε` at `Wa`.

##### p25.3 Prove that the above adjunction reproduces the original comonad.
*Solution*
First, we can use the co-unit of the adjunction `ε` as the co-monadic extract, since `εWa W a = a`

Next, we can use the unit of the adjunction to define the co-monadic `duplicate` as the horizontal composition of three natural transformations `U^W ◦ η ◦ F^W` where `U^W: U^W -> U^W` and `F^W: F^W -> F^W`. Since `F^W` lifts `a` to `(W a, δa)`, `η` picks the co-evaluator `δa` which maps `W a -> W W a` and `U^W` has no action on morphisms, we see that `duplicate = U^W ◦ η ◦ F^W`.



# Section 26: Ends and Coends (No Challenges)

# Section 27: Kan Extensions (No Challenges)

# Section 28: Enriched Categories (No Challenges)

# Section 29: Topoi

##### p29.1 Show that the function `f` that is the pullback of `true` along the characteristic function must be injective.
*Solution*
If `f: a -> b` is the pullback of `true` along the characteristic function, then for any `a*`, `f*: a* -> b`, there exists some unique `h: a* -> a` such that `f* = f . h`

Consider the case where `a*` is the image of `f` and `f*` is the identity. If `f` is not injective, then for the `e1, e2, e1 != e2` in `a` such that `f(e1) = f(e2)`, `h` can map `f(e1) = f(e2)` to either `e1` or `e2`. Therefore `h` would not be unique, which implies that `f` must be injective.

# Section 30: Lawvere Theories

##### p30.1 Enumarate all morphisms between `2` and `3` in `F` (the skeleton of `FinSet`).
*Solution*
`(0->0, 1->0), (0->0, 1->1), (0->0, 1->2), (0->1, 1->0), (0->1, 1->1), (0->1, 1->2)`

##### p30.2 Show that the category of models for the Lawvere theory of monoids is equivalent to the category of monad algebras for the list monad.
*Solution*
First, let's note that the category of models of the Lawvere theory for monoids is equivalent to the category of all monoids, `Mon`. Now we will prove that `Mon` is equivalent to the category of monad algebras for the list monad.

First, given a monoid over the set `a`, we can produce an algebra `(a, f)` where `f` maps the list `L` to the monoidal product of the elements in `L`. Next, given an algebra `(a, f)`, we can produce a monoid over `a` by defining the monoidal product of `a1, a2` to be `f ([a1] cat [a2])`. The unit of this monoid is `[]`, and because of the monad condition `f . μa = f . T f` we see that:
```
f [a1, f [a2, a3]] =
  f [a1, a2, a3] =
  f [f [a1, a2], a3]
```
So the monoid associativity law is automatically satisfied.

##### p30.3 The Lawvere theory of monoids generates the list monad. Show that its binary operations can be generated using the corresponding Kleisli arrows.
*Solution*
The binary operations in the Lawvere theory of monoids are elements of the homset `LMon(2, 1)`, which are functions of two arguments that we can implement with only the monoidal operator. Each of these functions can be defined by a list composed of only those 2 unique elements. Since each Kleisli arrow in the hom-set `KlT (1, 2)` corresponds to a list composed of elements from the 2 element set, we can represent each binary operation in the Lawvere theory of monoids with a Kleisli arrow in `KlT (1, 2)`.

##### p30.4 `FinSet` is a subcategory of `Set` and there is a functor that embeds it in `Set`. Any functor on `Set` can be restricted to `FinSet`. Show that a finitary functor is the left Kan extension of its own restriction
*Solution*
Say `K: Set -> FinSet` is a functor that embeds a set into `FinSet`, such that for any finite set `n` in `Set`, `K n = n`. Then `FinSet(K n, a)` is a hom-set between elements in `FinSet`, and so `FinSet(K n, a) = a^(K n) = a^n`.

Now consider some finitary functor `F`. The left Kan extension of `F`'s restriction to `FinSet` along `K` is
```
LanK F a =
  ∫^n FinSet(K n, a) × F n =
  ∫^n a^n × F n = \\ definition of finitary functor
  F
```
So a finitary functor is the left Kan extension of its own restriction.

# Section 31: Monads, Monoids, and Categories

##### p31.1 Derive unit and associativity laws for the tensor product defined as composition of endo-1-cells in a bicategory.
*Solution*

**Unit Law**
The left and right compositions of any endo-1-cell `T` and the identity 1-cell `id` are `T . id` and `id . T`. By the definition of a bicategory there exist invertible 2-cells mapping each of these endo-1-cells to `T`.

**Associativity Law**
Given three endo-1-cells `T1, T2, T3`, by the definition of a bicategory there exists an invertible 2-cell that maps between `((T1 . T2) . T3` and `T1 . (T2 . T3)`.


##### p31.2 Check that monad laws for a monad in `Span` correspond to identity and associativity laws in the resulting category.
*Solution*
A monad in Span consists of an endo-1-cell that has the sets `Ar, Ob` with the functions
```
dom :: Ar -> Ob
cod :: Ar -> Ob
```
and the associated 2-cells:
```
μ: Ar x Ar -> Ar
η: Ob -> Ar
```
This monad defines a category consisting of the objects in `Ob` and the arrows in `Ar`, where each arrow in `Ar` connects `dom Ar` to `cod Ar`.

**Identity**
`η` assigns an identity arrow to each object such that
```
dom . η = id
cod . η = id
```
Therefore for any object `o1` in `Ob` and arrow `a1` in `Ar` where `cod a1 = o1`, we see that:
```
dom (μ (a1, η o1)) = dom a1
cod (μ (a1, η o1)) = cod (η o1) = o1 = cod a1
```
So the composition of an arrow with the identity arrow does not change that arrow's domain or codomain.

**Associativity**
By the monoid law for `μ`
```
μ (Ar x μ (Ar x Ar)) = μ (μ (Ar x Ar) x Ar)
```
Therefore, for any arrows `a1, a2, a3`, we see that
```
a1 . (a2 . a3) = (a1 . a2) . a3
```


##### p31.3 Show that a monad in `Prof` is an identity-on-objects functor.
*Solution*
In `Prof`, we define a monad with an endo-profunctor `T` such that `T: Cop x C -> Set`. The composition of profunctors is
```
(q . p) a b = ∫^c p c a × q b c
```
So the composition of `T` with itself is:
```
(T . T) C C =
    ∫^c T c C × T C c = // existential quantifier
    T C C
```
Which implies that `T` must map each object in `C` to itself.

##### p31.4 What’s a monad algebra for a monad in `Span`?
*Solution*
Given a monad `m` over some object `a`, we form an algebra over this monad with a map `alg :: m a -> a` that satisfies commutativity conditions. For a monad in `Span`, we can use `dom` or `cod` for `alg`.

**Identity** `alg . ηa = ida`
This holds by the definition of `η` for `Span`

**Associativity** `alg . μa = alg . m alg`
Without loss of generality, we can see the following:
```
dom . μa (a1, a2) =
    dom a1 =
    dom . m dom (a1, a2)
```
