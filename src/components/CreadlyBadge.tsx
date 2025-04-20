import { useEffect, useRef } from 'react';
import { interceptHttpGet } from "next/dist/experimental/testmode/httpget";

interface Props {
    BadgeId: string;
}

const CredlyBadge = ({BadgeId}: Props) => {
    const badgeRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//cdn.credly.com/assets/utilities/embed.js';
        script.async = true;
        script.type = 'text/javascript';

        // Only append if not already appended
        const existingScript = document.querySelector('script[src="//cdn.credly.com/assets/utilities/embed.js"]');
        if (!existingScript) {
            document.body.appendChild(script);
        } else {
            // Re-run embed if script already exists
            if (window?.CredlyBadge) {
                window.CredlyBadge.embed();
            }
        }
    }, []);

    return (
        <div
            ref={badgeRef}
            data-iframe-width="450"
            data-iframe-height="270"
            data-share-badge-id={BadgeId}
            data-share-badge-host="https://www.credly.com"
        ></div>
    );
};

export default CredlyBadge;