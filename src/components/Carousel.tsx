import React, { useRef, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export interface CarouselItem {
  id: number;
  content: React.ReactNode;
  width?: number | string;
}

export interface CarouselProps {
  items: CarouselItem[];
  defaultWidth?: number;
  gap?: number;
}

export default function Carousel(props: CarouselProps) {
  const { 
    items, 
    defaultWidth = 300, 
    gap = 16 
  } = props;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 416;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {showLeft && 
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ChevronLeft />
        </IconButton>
      }

      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          display: 'flex',
          gap: `${gap}px`,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          py: 1
        }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              minWidth: item.width ?? defaultWidth,
              flexShrink: 0
            }}
          >
            {item.content}
          </Box>
        ))}
      </Box>

      {showRight && 
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'background.paper',
            borderWidth: '2px',
            borderStyle: 'solid',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'background.paper',
              borderColor: 'red',
              borderWidth: '2px',
              borderStyle: 'solid',
              opacity: 1,
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      }
    </Box>
  );
}