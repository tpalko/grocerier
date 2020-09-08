# Grocerier

Grocerier is an attempt at a self-constructing grocery list based on historical purchase
data and tracking the contents of the pantry, fridge, and freezer.

The aims here was mostly to get myself back into React. I worked with it quite a bit
a couple years ago and really enjoyed state as a first-order concept and generally
the aspects of SPA coding.

## Quick Start 

```
npm install 
npm start
```

**References**

https://www.npmjs.com/  
https://reactjs.org/  
https://git-scm.com/

## Changelog

**2020-09-08**

Performs basic inventory entry with name, quantity adjustment, single tags, units, all
of these editable, as well as remove. A single router in the server doubles as the
data access layer. The client event handlers make the API calls. Basically, layers
are compacted for brevity at the expense of being multi-purpose. In all, a very
rudimentary React app with no styling.

## Goals

**Be Useful**

While automatically constructing a shopping list sounds sexy, a low-bar MVP is
necessary to stay alive. If this app is easier to use (read: more helpful) than
a pad and paper when it comes time to go shopping, it's a win. One initial inventory pass,
continuous tracking for post-shopping trips and when things are used up, show
a list of everything in increasing order of count (all the zeros, all the ones, etc.).
This means data entry must be smart (auto-fill, minimal clicking and typing) and
the app must remind, urge, and train users to make the app part of their daily routine.
This app is meant to be interacted with on-the-go (in the kitchen or the store),
obviously mostly mobile device, and so the UX should guess and assist with user
input as much as possible and be optimized for minimal clicks.

**Maintain Full Functionality in the API**

As a best practice, anything the UI does should be able to be replicated with cURL.
Within this, good API design.

**Predictive Capability**

To be able to automatically construct a shopping list, we need data. The data model
isn't set yet, but the more the better. At a minimum, purchase history and exhaustion
history (when things are used up). Better, additional contextual information: a picture
of the household routine, permanent residents, primary recipes and at what frequency, etc.
Also additional events with timestamps such as significant changes in household routine,
added or removed permanent residents, diet changes, etc. We also need corrective
data once the predictive capability is reached. So, data models, heuristics, and input
mechanisms.

**Look Good**

Not only for usability, but mostly for usability. And partly for the sake of looking good.
Everything should be big and readable and render nicely on mobile. I'm a fan
of colors and purposeful alignment to direct the eye as opposed to boxes and lines.

**Current Tech**

Since one of the main drivers for this application is simply for me to work my way
back into the Node.js "scene", decisions will be made here that would not be made
in the common workplace for reasons such as budgeting or deadlines. This is a tech
playground and even if something works, it will be broken in order to fix it again. For fun.

## Contributing

PRs are welcome. Please contact me first, however. I may file issues in Github, but for
now it's a green field. If you'd like to contribute, contact tim at palkosoftware dot
com for PR access.
