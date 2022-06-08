# @bond-london/gatsby-graphql-typegen

Plugin to generate graphql types for Gatsby.

It uses the same approach as the core graphqlTypegen but provides a few more options

## Installation

```shell
yarn add @bond-london/gatsby-graphql-typegen
```

## Configuration

Add to your `gatsby-config.ts` and configure it as shown below.

```
    {
      resolve: "@bond-london/gatsby-graphql-typegen",
      options: {
        gatsbyTypesFile: "gatsby-types.d.ts",
        configOptions: {
          skipTypename: false,
        },
      },
    },

```

If you specify the `gatsbyTypesFile` make sure that the `tsconfig.json` file correctly picks it up.

## Configuration options

| Key                         | Type     | Description                                                                                                            |
| --------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `gatsbyTypesFiles`          | String   | The name of the types file. This is useful if you use tailwind and don't want to generate in the src directory         |
| `configOptions`             | Object   | Additional configuration options. See https://www.graphql-code-generator.com/plugins/typescript for details            |
| `additionalTypescriptFiles` | String[] | Additional files to read queries from in addition to the defaults. [`./gatsby-node.ts`,`./plugins/**/gatsby-node.ts` ] |
