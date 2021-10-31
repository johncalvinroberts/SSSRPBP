# sssrpbp
**S**uper **S**imple **S**tatic **R**eact **P**rototyping **B**oiler**p**late

A thin starter/boilerplate with all of the configs I like, to start coding React stuff quickly. Very few dependencies, just a solid dev workflow foundation, meant to be deconstructible when an app gets more complex.

Statically generated for super fast TTI and SEO. Sometimes, [Gatsby](https://github.com/gatsbyjs/gatsby) is a tad bit overkill when you want something quick and simple.

### Dependencies
* react & react-dom
* eslint
* prettier
* [vite bundler](https://vitejs.dev/)
* [react-snap](https://github.com/stereobooster/react-snap) for static prerendering

### Templates
* **default** - React
* **preact** - same, but with Preact, and parcel instead of vite.
* **typescript** - Same as `React` but setup with Typescript.

### Getting Started
* Run `npx sssrpbp --name=<name of your app> --template=<name of template>` (or copy the files from `template/default` in this repo)
* `yarn`
* `yarn start`
* To build - `yarn build`
* Start writing code of questionable integrity.

**Fun Fact**: This starter has a large dependency `puppeteer` included because of the `react-snap` dependency. If you are experiencing long install times, try running `export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` before `yarn install`.


**Note**: This starter is just meant for __prototyping__, if you have actual production-facing business requirements to address, you should probably go for a different solution.
