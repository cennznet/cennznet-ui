# CENNZnet UI

A Portal into the CENNZnet networks. Provides a view and interaction layer from a browser.

## Get Started

To start off, this repo uses yarn workspaces to organise the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

1. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
2. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/docs/install) is required.
3. Clone the repo locally, via `git clone https://github.com/cennznet/cennnznet-ui`
4. Install the dependencies by entering the apps directory running yarn: `cd cennznet-ui && yarn install`
5. Ready! Now you can launch the UI (assuming you have a local CENNZnet Node running), via `yarn run start`
6. Access the UI via [http://localhost:3000](http://localhost:3000)
