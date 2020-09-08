# Grocerier

Grocerier is an attempt at a self-constructing grocery list based on historical purchase 
data and tracking the contents of the pantry, fridge, and freezer. 

The aims here was mostly to get myself back into React. I worked with it quite a bit
a couple years ago and really enjoyed state as a first-order concept and generally 
the aspects of SPA coding.

## Changelog

**2020-09-08**

Performs basic inventory entry with name, quantity adjustment, single tags, units, all
of these editable, as well as remove. A single router in the server doubles as the 
data access layer. The client event handlers make the API calls. Basically, layers
are compacted for brevity at the expense of being multi-purpose. In all, a very
rudimentary React app with no styling.

## Goals 

To be able to automatically construct a shopping list, we need data. The data model 
isn't set yet, but the more the better. At a minimum, 
* Some styling. Everything should be big and readable and render nicely on mobile. I'm a fan
of colors and purposeful alignment to direct the eye as opposed to boxes and lines.

* Purchase data input

* Shopping list formation - at least a first pass calculating rates of usage. Eventually,
this should factor in a desired shopping frequency.

This app is meant to be interacted with on-the-go (in the kitchen or the store), 
obviously mostly mobile device, and so the UX should guess and assist with user 
input as much as possible and be optimized for minimal clicks.

## Contributing 

PRs are welcome. Please contact me first, however. I may file issues in Github, but for
now it's a green field. If you'd like to contribute, contact tim at palkosoftware dot 
com for PR access.
