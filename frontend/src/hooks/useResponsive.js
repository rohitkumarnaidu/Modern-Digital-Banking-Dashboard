/**
 * useResponsive Hook
 *
 * Purpose:
 * Custom hook for responsive design that provides screen size information
 * and breakpoint utilities across components
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const getViewportSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState(getViewportSize);
  const frameRef = useRef(null);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize(getViewportSize());
    };

    const handleResize = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = requestAnimationFrame(updateScreenSize);
    };

    updateScreenSize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const isMobile = screenSize.width < BREAKPOINTS.md;
  const isTablet = screenSize.width >= BREAKPOINTS.md && screenSize.width < BREAKPOINTS.lg;
  const isDesktop = screenSize.width >= BREAKPOINTS.lg;
  const isXS = screenSize.width < BREAKPOINTS.xs;

  const getResponsiveValue = useCallback(
    (mobileValue, tabletValue, desktopValue) => {
      if (isMobile) return mobileValue;
      if (isTablet) return tabletValue || mobileValue;
      return desktopValue || tabletValue || mobileValue;
    },
    [isMobile, isTablet]
  );

  const getResponsivePadding = useCallback(
    (scale = 1) => {
      const mobile = 16 * scale;
      const tablet = 24 * scale;
      const desktop = 32 * scale;

      if (isMobile) return `${mobile}px`;
      if (isTablet) return `${tablet}px`;
      return `${desktop}px`;
    },
    [isMobile, isTablet]
  );

  const getResponsiveFontSize = useCallback(
    (baseSize = 16) => {
      if (isMobile) return `${baseSize * 0.875}px`;
      if (isTablet) return `${baseSize}px`;
      return `${baseSize * 1.125}px`;
    },
    [isMobile, isTablet]
  );

  return useMemo(
    () => ({
      screenSize,
      breakpoints: BREAKPOINTS,
      isMobile,
      isTablet,
      isDesktop,
      isXS,
      getResponsiveValue,
      getResponsivePadding,
      getResponsiveFontSize,
    }),
    [
      screenSize,
      isMobile,
      isTablet,
      isDesktop,
      isXS,
      getResponsiveValue,
      getResponsivePadding,
      getResponsiveFontSize,
    ]
  );
};

export default useResponsive;
