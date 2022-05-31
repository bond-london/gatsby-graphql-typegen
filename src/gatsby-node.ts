import { CreatePagesArgs, NodePluginArgs, ParentSpanPluginArgs } from "gatsby";
import { IProgram } from "gatsby/dist/commands/types";
import {
  writeGraphQLConfig,
  writeGraphQLFragments,
  writeGraphQLSchema,
} from "gatsby/dist/utils/graphql-typegen/file-writes";
import { writeTypeScriptTypes } from "gatsby/dist/utils/graphql-typegen/ts-codegen";

async function generateInformation(args: NodePluginArgs) {
  const { store, reporter } = args;

  const { schema, definitions, program } = store.getState();
  const directory = (program as IProgram).directory;

  reporter.info("Building typescript definitions");
  try {
    await writeGraphQLSchema(directory, schema);
    await writeGraphQLFragments(directory, definitions);
    await writeTypeScriptTypes(directory, schema, definitions);
    await writeGraphQLConfig(program);
  } catch (err) {
    reporter.panic("Error in typescript", err as Error);
  }
}

export function onPostBootstrap(args: ParentSpanPluginArgs) {
  return generateInformation(args);
}

export function createPages(args: CreatePagesArgs) {
  return generateInformation(args);
}

export function onPluginInit(args: NodePluginArgs) {
  const { reporter } = args;
  reporter.info("Configuring for building typescript definitions");
}
