import {
    PUBLIC_WP_REST_API_DOMAIN
} from '$env/static/public'

// TODO: Better error handling!

// https://rodneylab.com/using-fetch-sveltekit/
/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
    try {

        // return home page instead

        console.log('[slug/+page.server.js] Requesting pages and posts for slug:', 'home');

        // https://scottspence.com/posts/fetch-data-from-two-or-more-endpoints-in-svelte
        console.log('[slug/+page.server.js] Requesting:', `${PUBLIC_WP_REST_API_DOMAIN}/wp-json/wp/v2/pages?slug=home`);
        const [pagesReq] = await Promise.all([
            fetch(`${PUBLIC_WP_REST_API_DOMAIN}/wp-json/wp/v2/pages?slug=home`),
        ]);

        console.log('Received', {
            pagesReqStatus: pagesReq.status,
        });


        if (!pagesReq.ok) {

            console.error("Error in fetches, at least one fetch returned other status code than 200!");
            [pagesReq].forEach(async (req) => {
                if (!req.ok) {
                    const errorMessageText = await req.json(); // TODO: always json?!
                    console.error('Request failed:', {
                        req,
                        errorMessageText
                    });
                }
            });

        }

        let pages = [];
        if (pagesReq.ok) {
            pages = await pagesReq.json();
        }

        return {
            entries: pages
        };

    } catch (error) {
        console.error(`Error in load function for /: ${error}`);
    }
};