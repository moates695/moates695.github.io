import { Avatar, Box } from "@mui/material";
import { postgresDeployLink } from "../../middleware/links";
import pypiLogo from "../../assets/pypi-logo.png";
import MarkdownBlock from "../../components/MarkdownBlock";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  Panel,
  Callout,
  ExternalButton,
  PageNav,
} from "../../components/design";

const ACCENT = "#d8aa78";

export default function OtherPostgresDeploy() {
  const targetFolder = `\`\`\`text
sql/
  <schema name>/
    functions/
      <function_name>.sql
    materialized_views/
      <mat_view_name>.sql
    tables/
      <table_name>.json
    triggers/
      <trigger_name>.sql
    views/
      <view_name>.sql
\`\`\``;

  const tableJson = `\`\`\`json
{
  "columns": [
    {
      "name": "col0",
      "type": "numeric",
      "not_null": true,
      "default": 5,
      "type_convert_using": "col0::numeric"
    },
    {
      "name": "col1",
      "type": "text"
    }
  ],
  "constraints": {
    "primary_key": [
      "col1"
    ],
    "foreign_key": [],
    "check": [
      {
        "name": "col0_gt_2",
        "condition": "col0 > 3"
      }
    ],
    "unique": [
      {
        "name": "unique_1",
        "columns": [
          "col0"
        ]
      }
    ]
  },
  "indexes": [
    {
      "name": "idx_table0",
      "columns": [
        "col0"
      ]
    }
  ]
}
\`\`\``;

  const codeString = `\`\`\`python
from postgresdeploy import deploy
from downerhelper.secrets import get_config_dict, get_secret_json
from dotenv import load_dotenv
import os
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--env-path", required=True)
args = parser.parse_args()

load_dotenv(dotenv_path=args.env_path, override=True)

def main():
    secret_json = get_secret_json(os.environ, "DB_CONFIG_SECRET")
    pg_creds = get_config_dict(secret_json["name"], secret_json["url"], os.environ["DB_NAME"])
    deploy("sql", pg_creds)

if __name__ == "__main__":
    main()
\`\`\``;

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: { xs: 3, sm: 4 },
        pb: 4,
      }}
    >
      <PageHeader
        eyebrow="package"
        title={<>Postgres <GradientText>Deploy</GradientText></>}
        subtitle="A Python package that simplifies deploying Postgres schemas. Point it at a folder and it deploys or updates the schema in the target database, or mirrors an existing database back into files."
        actions={
          <ExternalButton
            href={postgresDeployLink}
            icon={
              <Avatar alt="pypi icon" src={pypiLogo} sx={{ width: 24, height: 24 }} />
            }
          >
            PyPI Package
          </ExternalButton>
        }
      />

      <Reveal delay={0.06}>
        <MarkdownBlock>
          {`We have all been there: a bug in the app turns out to be a column or type we forgot to add when pushing updates to a new environment. Wired into pipelines, a developer can work in dev and update the schema files locally, then when they push to test or prod the Postgres schema is automatically updated to reflect the changes.`}
        </MarkdownBlock>
        <Callout accent={ACCENT} title="status">
          Currently on its first release and actively in progress.
        </Callout>
      </Reveal>

      <Reveal delay={0.12}>
        <SectionHeading eyebrow="layout">Target folder structure</SectionHeading>
        <MarkdownBlock>
          {`Functions, views, materialized views and triggers are just SQL files, organised by schema:`}
        </MarkdownBlock>
        <Panel accent={ACCENT}>
          <MarkdownBlock>{targetFolder}</MarkdownBlock>
        </Panel>
      </Reveal>

      <Reveal delay={0.18}>
        <SectionHeading eyebrow="tables">Table definition</SectionHeading>
        <MarkdownBlock>
          {`Tables are described with JSON, capturing columns, constraints and indexes:`}
        </MarkdownBlock>
        <Panel accent={ACCENT}>
          <MarkdownBlock>{tableJson}</MarkdownBlock>
        </Panel>
      </Reveal>

      <Reveal delay={0.24}>
        <SectionHeading eyebrow="usage">Invoking a deployment</SectionHeading>
        <MarkdownBlock>
          {`A developer might invoke the deployment through an action like this:`}
        </MarkdownBlock>
        <Panel accent={ACCENT}>
          <MarkdownBlock>{codeString}</MarkdownBlock>
        </Panel>
      </Reveal>

      <PageNav left={{ text: "Downer Helper", link: "/other/downer-helper" }} />
    </Box>
  );
}
