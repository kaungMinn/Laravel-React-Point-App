// resources/js/Components/Pagination.tsx

import { Link } from '@inertiajs/react';
import React from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

const MAX_VISIBLE_PAGES = 5;

// Helper to render >> and << instead of &raquo; and &laquo;
const getLabel = (label: string) => {
    if (label.includes('Next')) return '>>';
    if (label.includes('Previous')) return '<<';
    return label;
};

const MobilePagination = ({ links }: PaginationProps) => {
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const currentPageLink = links.find(link => link.active);
    const totalPages = links.length - 2; // Subtract Prev/Next links
    const currentPage = currentPageLink ? links.indexOf(currentPageLink) : 1; // 1-based index

    const baseClasses = 'px-4 py-2 mx-1 border rounded text-sm transition duration-150 ease-in-out';
    const activeClasses = 'bg-indigo-600 text-white border-indigo-600';
    const defaultClasses = 'bg-white text-gray-700 hover:bg-gray-100';
    const disabledClasses = 'text-gray-400 bg-gray-50 cursor-not-allowed';

    const renderButton = (link: PaginationLink) => {
        const classes = link.url
            ? link.active ? activeClasses : defaultClasses
            : disabledClasses;

        const content = getLabel(link.label);

        return link.url ? (
            <Link
                key={content}
                href={link.url}
                className={`${baseClasses} ${classes}`}
                preserveScroll
            >
                {content}
            </Link>
        ) : (
            <span key={content} className={`${baseClasses} ${classes}`}>
                {content}
            </span>
        );
    };

    return (
        <div className="flex justify-between items-center mt-6 sm:hidden">
            {/* Previous Button */}
            {renderButton(prevLink)}

            {/* Current Page Text */}
            <span className="text-sm font-medium text-gray-700 mx-4">
                Page {currentPage} of {totalPages}
            </span>

            {/* Next Button */}
            {renderButton(nextLink)}
        </div>
    );
};


export default function Pagination({ links }: PaginationProps) {
    if (!links || links.length <= 3) {
        return <div className='flex items-center justify-center mt-6'><span
            className={`px-4 py-2 mx-1 bg-black text-white border-indigo-600 rounded text-sm transition duration-150 ease-in-out`}
        >
            1
        </span></div>
    }

    // Pass the full set of links to the mobile component
    const totalLinks = links.length;
    const activeIndex = links.findIndex(link => link.active);
    const prevLink = links[0];
    const nextLink = links[totalLinks - 1];
    const pageLinks = links.slice(1, totalLinks - 1);
    const currentPage = activeIndex - 1;

    // 4. Implement the Ellipsis Filtering Logic
    const filteredPageLinks = pageLinks.filter((link, index) => {
        const isStartPage = index === 0;
        const isEndPage = index === pageLinks.length - 1;
        const isNearCurrent = Math.abs(index - currentPage) <= Math.floor(MAX_VISIBLE_PAGES / 2);

        return isStartPage || isEndPage || isNearCurrent;
    });

    // 5. Build the final array of links including ellipses
    const finalLinks: (PaginationLink | { type: 'ellipsis' })[] = [prevLink];
    let showStartEllipsis = false;
    let lastLinkIndex = -1; // Keep track of the last page number index added

    filteredPageLinks.forEach((link) => {
        const originalLinkIndex = links.indexOf(link);

        // Add start ellipsis if gap exists and not already shown
        if (originalLinkIndex > lastLinkIndex + 1 && lastLinkIndex !== -1 && originalLinkIndex > 1) {
            if (!showStartEllipsis) {
                finalLinks.push({ type: 'ellipsis' });
                showStartEllipsis = true;
            }
        }

        // Add the link
        finalLinks.push(link);
        lastLinkIndex = originalLinkIndex; // Update the last index added
    });

    // Check for end ellipsis
    const lastPageNumberIndex = totalLinks - 2;
    if (lastLinkIndex < lastPageNumberIndex && lastLinkIndex !== -1) {
        finalLinks.push({ type: 'ellipsis' });
    }

    // Add the Next link
    finalLinks.push(nextLink);

    return (
        <div className="flex flex-col">
            {/* 🛑 Mobile View: Only visible on small screens (sm:hidden) 🛑 */}
            <MobilePagination links={links} />

            {/* 🛑 Desktop View: Hidden on small screens (hidden sm:flex) 🛑 */}
            <div className="hidden sm:flex justify-center mt-6">
                {finalLinks.map((link, index) => {
                    const baseClasses = 'px-4 py-2 mx-1 border rounded text-sm transition duration-150 ease-in-out';

                    if ('type' in link && link.type === 'ellipsis') {
                        return (
                            <span key={index} className={`${baseClasses} text-gray-700 bg-white border-none cursor-default`}>
                                ...
                            </span>
                        );
                    }

                    const pageLink = link as PaginationLink;
                    const hasUrl = pageLink.url !== null;
                    const linkClasses = hasUrl
                        ? (pageLink.active
                            ? 'bg-black text-white border-indigo-600'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        )
                        : 'text-gray-400 bg-gray-50 cursor-not-allowed';

                    if (hasUrl) {
                        return (
                            <Link
                                key={index}
                                href={pageLink.url as string}
                                className={`${baseClasses} ${linkClasses} `}
                                preserveScroll
                            >
                                {getLabel(pageLink.label)}
                            </Link>
                        );
                    } else {
                        return (
                            <span
                                key={index}
                                className={`${baseClasses} ${linkClasses}`}
                            >
                                {getLabel(pageLink.label)}
                            </span>
                        );
                    }
                })}
            </div>
        </div>
    );
}