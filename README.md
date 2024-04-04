[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/mTyX4mC8)

# KWS2100 Assignment 1

### Click image to visit map

[![Visit Map](./public/istock.png)](https://kristiania-kws2100-2024.github.io/kws2100-publishing-a-map-application-Hedgehog1991/)
The goal of this assignment is to verify that you're able to deploy a working web application:

- [ x] Set up the project correctly to deploy React and OpenLayers with GitHub pages
- [ x] Add and style vector layers to the map
- [ x] Interact with the map using the pointer
- [ x] Display map feature properties in React

## How to work

Everyone who requested to be assigned a team or who didn't respond to the team survey will have their name listed for a team on Canvas. Each team will consist of 4-5 people and should split in two pairs (or a pair and a triple). Each pair should work on the same repository. The pairs should review each other's repositories on GitHub. All members should submit the link to their GitHub repository

## Setup

You _must_ do the following correctly in your project:

- [ x] Create a project with `package.json`
- [ x] Ensure that `.idea`, `node_modules` and any other temporary file is ignored from Git and not committed
- [ x] Set up build with `vite` as a GitHub Actions workflow
- [ x] Include verification with Prettier and Typescript in the build process
- [ x] Avoid pushing bad commits by adding a Husky git hook
- [ x] Include a link to their deployed GitHub Pages site
- [ x] Receive a code review from the other part of their team

## Features

The web application should show the civil defence regions of Norway as polygons and all emergency shelters as points. You can find both layers at https://kart.dsb.no.

- [ x] Both the polygon layer and point layer must have custom styles
- [ x] There must be some style change when hovering over a vector feature
- [ x] When clicking on an emergency shelter, more information about the shelter should be displayed in an aside or overlay
- [ x] The style of an emergency shelter should vary based on the feature properties of that shelter

If you wish, you can add additional layers to the map
