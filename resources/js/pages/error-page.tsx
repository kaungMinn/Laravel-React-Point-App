// resources/js/Pages/Error.tsx

import { Head } from '@inertiajs/react';

export default function Error({ status }: { status: number }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Not Found',
        403: '403: Forbidden',
    }[status];

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Head title={title} />
            <div className="text-center p-10 bg-white shadow-xl rounded-lg">
                <h1 className="text-6xl font-extrabold text-gray-800">{status}</h1>
                <div className="pt-8 text-xl font-medium text-gray-700">{description}</div>
            </div>
        </div>
    );
}