import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures every navigation transition (via header links, in-page links, or browser back/forward)
 * resets the viewport scroll position to the top of the destination page.
 */
export const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Reset scroll position on route pathname change
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.documentElement) {
            document.documentElement.scrollTop = 0;
        }
        if (document.body) {
            document.body.scrollTop = 0;
        }
    }, [pathname]);

    return null;
};

