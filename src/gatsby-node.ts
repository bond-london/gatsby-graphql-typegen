import {
  NodePluginArgs,
  ParentSpanPluginArgs,
  PluginOptionsSchemaArgs,
  Reporter,
  Store,
} from "gatsby";
import { IProgram } from "gatsby/dist/commands/types";
import {
  writeGraphQLConfig,
  writeGraphQLFragments,
  writeGraphQLSchema,
} from "gatsby/dist/utils/graphql-typegen/file-writes";
import { writeTypeScriptTypes } from "./ts-codegen";
import { AnyEventObject } from "xstate";

interface Options {
  gatsbyTypesFile: string;
}

async function schemaTypegen(
  options: Options,
  reporter: Reporter,
  store: Store,
  event: AnyEventObject
) {
  const schema = event.payload;
  const { program } = store.getState();
  const directory = (program as IProgram).directory;

  reporter.verbose(`Re-Generating schema.graphql`);

  try {
    await writeGraphQLSchema(directory, schema);
  } catch (err) {
    reporter.panicOnBuild({
      id: `12100`,
      context: {
        sourceMessage: err,
      },
    });
  }
}

async function definitionsTypegen(
  options: Options,
  reporter: Reporter,
  store: Store,
  event: AnyEventObject
) {
  const { program, schema } = store.getState();

  const definitions = event.payload;
  const directory = (program as IProgram).directory;

  reporter.verbose(`Re-Generating fragments.graphql & TS Types`);

  try {
    await writeGraphQLSchema(directory, schema);
    await writeGraphQLFragments(directory, definitions);
    await writeTypeScriptTypes(
      directory,
      options.gatsbyTypesFile,
      schema,
      definitions
    );
  } catch (err) {
    reporter.panicOnBuild({
      id: `12100`,
      context: {
        sourceMessage: err,
      },
    });
  }
}

export async function onPostBootstrap(
  args: ParentSpanPluginArgs,
  options: Options
) {
  const { store, emitter, reporter } = args;
  const { program } = store.getState();
  reporter.info("Building typescript definitions");
  try {
    await writeGraphQLConfig(program);
  } catch (err) {
    reporter.error("Error in typescript", err as Error);
  }

  emitter.on("SET_GRAPHQL_DEFINITIONS", (event: AnyEventObject) => {
    definitionsTypegen(options, reporter, store, event)
      .then(() => {
        /* noop */
      })
      .catch((error) =>
        reporter.error("Error running definitions typegen", error as Error)
      );
  });
  emitter.on("SET_SCHEMA", (event: AnyEventObject) => {
    schemaTypegen(options, reporter, store, event)
      .then(() => {
        /* noop */
      })
      .catch((error) =>
        reporter.error("Error running schema typegen", error as Error)
      );
  });
}

export function onPluginInit(args: NodePluginArgs) {
  const { reporter } = args;
  reporter.info("Configuring for building typescript definitions");
}

export function pluginOptionsSchema(args: PluginOptionsSchemaArgs) {
  const { Joi } = args;
  return Joi.object({
    gatsbyTypesFile: Joi.string()
      .description("Location of the gatsby types file")
      .default("src/gatsby-types.d.ts"),
  });
}
