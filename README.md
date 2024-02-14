# KWS2100 Assignment 1

<TODO: Put a badge to your deployed project here>

The goal of this assignment is to verify that you're able to deploy a working web application:

- [ ] Set up the project correctly to deploy React and OpenLayers with GitHub pages
- [ ] Add and style vector layers to the map
- [ ] Interact with the map using the pointer
- [ ] Display map feature properties in React

## How to work

Everyone who requested to be assigned a team or who didn't respond to the team survey will have their name listed for a team on Canvas. Each team will consist of 4-5 people and should split in two pairs (or a pair and a triple). Each pair should work on the same repository. The pairs should review each other's repositories on GitHub. All members should submit the link to their GitHub repository

## Setup

You *must* do the following correctly in your project:

- [ ] Create a project with `package.json`
- [ ] Ensure that `.idea`, `node_modules` and any other temporary file is ignored from Git and not committed
- [ ] Set up build with `vite` as a GitHub Actions workflow
- [ ] Include verification with Prettier and Typescript in the build process
- [ ] Avoid pushing bad commits by adding a Husky git hook
- [ ] Include a link to their deployed GitHub Pages site
- [ ] Receive a code review from the other part of their team

## Features

The web application should show the civil defence regions of Norway as polygons and all emergency shelters as points. You can find both layers at https://kart.dsb.no.

- [ ] Both the polygon layer and point layer must have custom styles
- [ ] There must be some style change when hovering over a vector feature
- [ ] When clicking on an emergency shelter, more information about the shelter should be displayed in an aside or overlay
- [ ] The style of an emergency shelter should vary based on the feature properties of that shelter

If you wish, you can add additional layers to the map

