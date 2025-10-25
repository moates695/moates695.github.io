import { Avatar, Box, Button, Typography } from "@mui/material";
import PageLinks from "../../components/PageLinks";
import BottomNavigation from "../../components/BottomNavigation";
import { buildBulletPoints } from "../../middleware/helpers";
import { cellularTrackingGithubLink } from "../../middleware/links";
import githubLogo from "../../assets/github-logo.png";

export default function OtherCellularTracking() {
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
      <Typography variant="h5">
        Cellular Tracking
      </Typography>
      <Box>
        <Button 
          variant="outlined"
          href={cellularTrackingGithubLink}
          target="_blank"
          rel="noopener"
          startIcon={
            <Avatar
              alt="github icon" 
              src={githubLogo}
              sx={{ 
                width: 32, 
                height: 32, 
                marginRight: '10px'
              }}
            />
          }
        >
          GitHub
        </Button>
      </Box>
      <Typography>
        This group project for UNSW's COMP9517 (Computer Vision) course set the
        challenge of segmenting cells and tracking their position, size and divisions
        in each of the four provided sequences.
        <br/>
        I have included this in my personal projects because I happened to do 
        most of the legwork, and I really enjoyed working on this project during lockdown.
        <br/>
        The solution leverages included Python ML libraries like OpenCV, scikit-image, matplotlib and SciPy,
        and additional custom functions to better suit the problem.
        <br/>
      </Typography>
      <Typography>
        <Typography variant="h6">
          Segmenting
        </Typography>
        To segment the images from the background, for each image in a sequence,
        <br/>
        <Typography sx={{marginLeft: 2}}>
          1. Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) preprocessing <br/>
          2. Calculate histogram with 257 bins, and iterate to find an intensity 
          threshold where the histogram stops decreasing consistently <br/>
          3. The selected intensity is scaled to form the final pixel 
          threshold value for segmentation <br/>
          4. Create a binary mask of pixels above the threshold <br/>
          5. Apply a morphological open with a 5×5 rectangular kernel <br/>
          to remove noise and small artifacts <br/>
          6. Flush cells that are touching the image border (to prevent erosion from image) <br/>
          7. Apply watershed to segment cells from each other <br/>
          8. Apply a seperate open to all cells (morphological open but each cell is treated
          in its own image space) <br/>
          9. Apply labels to cells <br/>
          10. Delete small 'cells' (these are likely background noise or out of focus) <br/>
          11. Compare flushed cells with current cells to determine their inclusion <br/>
        </Typography>
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/segBefore.png"
            alt="segment before"
            sx={{width: 500}}
          />
          <Typography>
            Original Image
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            component="img"
            src="/segAfter.png"
            alt="segment before"
            sx={{width: 500}}
          />
          <Typography>
            Segmented Image
          </Typography>
        </Box>
      </Box>
      <Typography>
        <Typography variant="h6">
          Tracking
        </Typography>
        Now that the cells are segmented and labelled, they can be tracked in a sequence,
        <br/>
        <Typography sx={{marginLeft: 2}}>
          1. Compute centroids for the first frame of the sequence <br/>
          2. Initialise tracking,
          <Typography sx={{marginLeft: 2}}>
            a. global label tracking across frames <br/>
            b. frame-specific centroid labels <br/>
            c: per-frame centroid displacement tracking <br/>
          </Typography>
          3. For each frame, computer centroids for current and next frame, as well as
          the distance matrix between consecutive frames <br/>
          4. Match centroids between frames with neareset neighbour, but only those within 
          a threshold (cells may appear in frame) <br/>
          5. Assign global labels to each cell in the sequence so they can be tracked
          between frames <br/>
          6. For each frame, detect a cells that are in the process of "splitting"
          and label these events (including previous frames) <br/>
          7. Filter out small cells and short lived cells as potential noise. <br/>
          8. For each frame,
          <Typography sx={{marginLeft: 2}}>
            a. outline each cell with a colour based on its label id <br/>
            b. highlight cell splitting events in white <br/>
            c: draw trajectories onto the image <br/>
          </Typography>
        </Typography>
      </Typography>
      <Box
        component="video"
        src="/videos/output1_encoded.mp4"
        controls
        sx={{ maxWidth: "50%", borderRadius: 2, alignSelf: 'center' }}
      />
      {/* <video width="100%" height="auto" controls>
        <source src="/videos/output1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <Typography>
        <Typography variant="h6">
          Improvements
        </Typography>
        Apparently just being able to segment some of the cells from the background
        was quite an achievement for this assignment, let alone tracking some of them
        over time. 
        <br/>
        That being said, if I could go back in time, this is what I would change,
        {buildBulletPoints([
          'use curvature based overlap detection, instead of seperation filtering methods',
          "for cells that flash in and out of existing between frames, \
          use a predictive model of their trajectory to link them between non-consecutive frames",
          'also use the regions around these flashing cells to perform a secondary, \
          more aggressive segmentation, in an attempt to locate these faint cells'
        ])}
      </Typography>
       {BottomNavigation({
        left:  {
          text: 'Other Projects',
          link: '/other'
        },
        right:  {
          text: 'Downer Helper',
          link: '/other/downer-helper'
        }
      })}
    </Box>
  )
}