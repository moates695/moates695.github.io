import { Avatar, Box, Button, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import { buildBulletPoints } from "../../middleware/helpers";
import { cellularTrackingGithubLink, postgresDeployLink } from "../../middleware/links";
import githubLogo from "../../assets/github-logo.png";
import pypiLogo from "../../assets/pypi-logo.png";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function OtherPostgresDeploy() {
  const targetFolder = `
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
      <view_name>.sql`;
  
  const tableJson = `
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
}`;

  const codeString = `
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
    main()`;
  
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        gap: '10px',
        marginBottom: 2
      }}
    >
      <PageLinks />
      <Typography variant="h5">
        Postgres Deploy
      </Typography>
      <Box>
        <Button 
          variant="outlined"
          href={postgresDeployLink}
          target="_blank"
          rel="noopener"
          startIcon={
            <Avatar
              alt="github icon" 
              src={pypiLogo}
              sx={{ 
                width: 32, 
                height: 32, 
                marginRight: '10px'
              }}
            />
          }
        >
          pypi package
        </Button>
      </Box>
      {BottomNavigation({
        left:  {
          text: 'Downer Helper',
          link: '/other/downer-helper'
        }
      })}
      <Typography>
        This project is meant the simplify the deployment of Postgres schemas.
        It is currently first release and in progress.
        <br/>
        We have all been there, when a bug in our app turns out to be a 
        column or type we sort of forgot to add when pushing updates to the
        new environment.
        <br/>
        This PyPi package takes a folder and deploys or updates the schema
        in the target database. It can also take a target folder and mirror
        the target db schema. 
        <br/>
        When setup with pipelines, a developer can be
        working in dev and updating the schema files from local, but when
        they push to test or prod, the Postgres schema is automatically updated
        to reflect these new changes.
        <br/>
        Currently the target folder structure looks like
      </Typography>
      <SyntaxHighlighter 
        language="python" 
        style={oneDark}
        customStyle={{
          maxHeight: 'none',
          overflow: 'visible',
        }}
      >
        {targetFolder}
      </SyntaxHighlighter>
      <Typography>
        Where functions, views, materialized views and triggers are just sql files.
        <br/>
        For the table json the layout is,
      </Typography>
      <SyntaxHighlighter 
        language="python" 
        style={oneDark}
        customStyle={{
          maxHeight: 'none',
          overflow: 'visible',
        }}
      >
        {tableJson}
      </SyntaxHighlighter>
      <Typography>
        A developer might invoke the deployment through an action like this,
      </Typography>
      <SyntaxHighlighter 
        language="python" 
        style={oneDark}
        customStyle={{
          maxHeight: 'none',
          overflow: 'visible',
        }}
      >
        {codeString}
      </SyntaxHighlighter>
       {BottomNavigation({
        left:  {
          text: 'Downer Helper',
          link: '/other/downer-helper'
        }
      })}
    </Box>
  )
}