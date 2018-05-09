# Contentful UI Extensions

SumUp uses [Contentful](https://contentful.com) as the CMS of choice for many of our web projects. Over time our use cases have become more complex and we've needed ways to enhance the editing experience for our content creators. Contentful allows us to customize and extend the functionality of the Web Application's entry editor through [UI extensions](https://github.com/contentful/ui-extensions-sdk). Extensions can be custom user interface controls for fields, such as a dropdown, or help with workflows, data management and integrations.

## Documentation

This [quick introduction](https://www.contentful.com/developers/docs/concepts/uiextensions/) is a good place to get started with UI extensions. For more advanced and creative use cases, read this [blog post](https://www.contentful.com/blog/2017/10/09/creating-ui-extensions-with-contentful/). Refer to the [official SDK documentation](https://github.com/contentful/ui-extensions-sdk) for a list of available methods. You can also look through the existing extension files for inspiration.

## Getting started

We use [`lerna`](https://github.com/lerna/lerna) and [`yarn` workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) under the hood to make developing and publishing our extensions a breeze. After you first clone the repo, you probably want to [bootstrap](https://github.com/lerna/lerna#bootstrap) all packages for development. Run the following command in the project root:

```bash
yarn bootstrap
```

This command will install the dependencies for all packages and link any cross-dependencies.

## Creating a new extension

You can quickly bootstrap a new UI extension by running this command in the project root:

```bash
yarn create:extension <EXTENSION_ID> "<EXTENSION_NAME>"
```

This will create a new folder `./packages/<EXTENSION_ID>` with all the files your extension needs. The extension UI goes inside `./src/index.html`, the logic lives inside `./src/index.js`.

## Development

We use [`parcel`](https://github.com/parcel-bundler/parcel) to bundle the code. To start a development server with hot reloading, run the following command inside your extension folder:

```bash
yarn dev
```

Parcel generates a self-signed certificate to enable a secure `https` connection. This is important to get the extensions to work with Contentful's CSP policy. The first time you load the extension, you will likely get a security error. Simply add an exception for this certificate.

## Publishing to Contentful

Visit the [Contentful CLI docs](https://github.com/contentful/contentful-cli/tree/master/docs/extension) for up-to-date instructions to publish, update or manage the UI extensions on Contentful.
