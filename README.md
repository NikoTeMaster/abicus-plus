# Abicus-Plus
---
# This readme as well as the Abicus Plus calculator are both currently Work In Progress
## About Abicus Plus
Abicus Plus is an fork of the scientific calculator Abicus made by the Finnish Matriculation Examination board for their digital matriculation examination software Abitti 2. 

The calculator has been modified with an additional "plugin" support which allows anyone to add custom code to use with Abicus however they see fit. For now there is just one plugin in /src/calculator/plugins which is an LaTeX parser (basically a translation layer for LaTeX to abicus).

> [!NOTE]
> The calculator **is work in progress** and currently is shipped with a **LaTeX parser** which might not work properly.
 > 
>This fork is entirely independent. The maintainer (@nikotemaster) is **not** directly affiliated with the Finnish Matriculation Examination Board (Ylioppilastutkintolautakunta), the Digabi project, or any upstream maintainers.
> 
>Some portions of the code originate from upstream contributors and their copyright(s) remain intact under the MIT license. You can find the original code at the [Digabi/Abicus repository](https://github.com/digabi/abicus) and its [license](https://github.com/digabi/abicus/blob/master/LICENCE.md).

# What to expect in the future?
In the future I wish to be able to create the following:
- Settings window for general settings
	- Ability to turn plugins on and off when there are more
- An ability to ignore indicators (m for meter, etc.)
- Certain standards to be directly integrated (Speed of Light, mass of earth, etc.)
	- An auto-fill option for them
- **A window where to you can see past calculation. (First Priority)**
	- Ability to switch between the existing keypad and a screen to see past calculation
	- Be able to re-do past calculations
- Multiple themes and maybe a way to switch between themes


<!--
[Installation]() ⋅
[User Guide]() ⋅
[Development Guide]()
-->

## Development Setup

Clone this repository and make sure you have [Node.js](https://nodejs.org/) installed on your system. The exact version used in development can be found in the [`.nvmrc` file](./.nvmrc).

When Node.js is ready and this repository has been cloned, install the packages by running the following in the cloned directory:

```bash
npm install
```

After all the required packages have been installed, run one of the following commands to start the development server:



  ```bash
  npm run dev
  ```



## Tests

This project uses the [Vitest testing framework](https://vitest.dev) for unit tests and [Playwright](https://playwright.dev) for UI tests. After the project has been [set up](#installation), to run all the tests for the project you can simply run:

```bash
npm run test
```

To run only the unit tests:

```bash
npm run test:unit
```

And to only run the UI tests:

```bash
npm run test:ui
```

Please see the Vitest and/or Playwright documentation for details on e.g. how to filter which tests to run etc.
