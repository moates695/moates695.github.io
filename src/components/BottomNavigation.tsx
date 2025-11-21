import { Box, Button } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNavigate } from "react-router-dom";

export interface NavigationData {
  text: string,
  link: string
}

export interface BottomNavigationProps {
  left?: NavigationData 
  right?: NavigationData
}

export default function BottomNavigation(props: BottomNavigationProps) {
  const {
    left = null,
    right = null
  } = props;

  const navigate = useNavigate();

  if (left === null && right == null) {
    return <></>;
  }

  const justify = ((): string => { 
    if (left !== null && right !== null) {
      return 'space-between'
    } else if (right === null) {
      return 'flex-start'
    } else {
      return 'flex-end'
    }
  })();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: justify,
        // paddingBottom: 2,
      }}
    >
      {left &&
        <Button 
          variant="outlined" 
          startIcon={<KeyboardDoubleArrowLeftIcon />}
          onClick={() => navigate(left.link)}
        >
          {left.text}
        </Button>
      }
      {right &&
        <Button 
          variant="outlined" 
          endIcon={<KeyboardDoubleArrowRightIcon />}
          onClick={() => navigate(right.link)}
        >
          {right.text}
        </Button>
      }
    </Box>
  )
}