import { Box, Link, Paper, Typography } from "@mui/material";
import PageLinks from "../components/PageLinks";
import { buildBulletPoints } from "../middleware/helpers";

export default function About() {
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        gap: '10px',
      }}
    >
      <PageLinks />
      <Typography variant="h5">About</Typography>

      <Typography variant="h6">Current Work</Typography>
      <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Senior Software Engineer &mdash; AI &amp; Backend
        </Typography>
        <Link
          href="https://voxworks.ai/"
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ fontWeight: 500 }}
        >
          Voxworks
        </Link>
      </Paper>

      <Typography variant="h6">Previous Experience</Typography>
      <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Automation Software Engineer &mdash; Downer Group
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          May 2023 &ndash; 2025
        </Typography>
        {buildBulletPoints([
          'Automate data extraction from spreadsheets using Azure function apps, stored in database with PowerBI connection, saving ~$175k a year per business unit implementation and eliminating manual transcribing errors',
          'Created a custom internal Azure dashboard for monitoring project resources across subscriptions, with resource actions and deployment monitoring',
          'Reduce operating costs of Azure resources by ~60% by scheduling startup and shutdown events with a centralised tagging policy enacted through dashboard',
          'Extract text with OCR from CAD drawing PDFs and generating project report spreadsheets with a time saving of ~95%',
          'Custom sFTP file routing to applications by allowing remote configuration from trusted actors, removing the need for developer intervention on config updates',
          'Wrote project setup shell scripts that deploy environments and resources in Azure, linked to custom GitHub branch environments with rules and protections to enable consistent IaC deployments using Bicep',
          'Automatic Konect API queries for critical field work, notifying requisite authorities to consistently meet SLAs and avoid total penalties of ~$450k',
          'Identified and designed automation solutions between existing cloud and on-prem systems, leveraging Azure microservices to eliminate manual workflows',
          'Enhanced security through daily storage account key rotation and SAS generation through Azure Key Vault, reducing 80-100 points of failure to a centralised point',
          'Created a custom PyPI module that wraps the Azure SDK with common commands to reduce code replication across projects, reducing technical debt by ~200 lines per project',
          'Developed a simple React frontend application so internal non-technical staff can easily submit data and run automated jobs',
          'Implemented bespoke deep learning and computer vision solutions for real time artefact recognition with ~94% accuracy',
          'Combine ML and classical analysis methods to read a variety of analogue meters with a limited dataset, approximately 85% accuracy',
          'Deploy and monitor new Esri ArcGIS Enterprise servers',
          'Configure Azure DevOps environment for integration with external tracking',
          'Liaise with management, determine opportunities for automation adoption in the business across divisions',
        ])}
      </Paper>
      <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Engineering Intern &mdash; Incat Crowther
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Feb 2023 &ndash; May 2023
        </Typography>
        {buildBulletPoints([
          'Highly proficient in producing accurate technical drawings with AutoCAD LT, focusing on double hull commercial vessels of 30-120 ft',
          'Quickly ascertained how boats are constructed and outfitted for service by creating and modifying technical frame and construction drawings for 3 vessels',
          'Complied with relevant classing authorities engineering standards such that vessels were safe to operate under varying oceanic conditions',
          'Efficiently produced precise cut parts, engine and rudder modification and machinery arrangement drawings for clients within a dynamic environment',
        ])}
      </Paper>
    </Box>
  );
}
