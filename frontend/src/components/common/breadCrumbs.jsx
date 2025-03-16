import { useLocation, useNavigate } from "react-router-dom";

const pages = [
    { name: "Option Chain", path: "/option-chain" },
    { name: "Realtime Data", path: "/realtime" },
];

export default function Breadcrumb() {
    const location = useLocation(); // Get the current path
    const navigate = useNavigate(); // Get the navigate function

    return (
        <nav aria-label="Breadcrumb" className="flex w-full">
            <ol className="flex space-x-4 rounded-md bg-extra-ivory dark:bg-gray-900 px-6 shadow-custom items-center">

                {/* Dynamic Breadcrumbs */}
                {pages.map((page) => (
                    <li key={page.name} className="flex">
                        <div className="flex items-center">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 24 44"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                                className="h-full w-6 shrink-0 dark:text-white"
                            >
                                <rect x="10" y="0" width="1" height="44" />
                            </svg>

                            <button
                                onClick={() => navigate(page.path)}
                                className={`ml-4 text-sm font-medium ${location.pathname === page.path
                                        ? "text-button-hover dark:text-[#99ccff] font-bold"
                                        : "text-black hover:text-button-default dark:text-white"
                                    }`}
                            >
                                {page.name}
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
            <svg
                fill="currentColor"
                viewBox="0 0 24 44" 
                preserveAspectRatio="none"
                aria-hidden="true"
                className="h-full w-6 shrink-0 dark:text-white"
            >
                <rect x="10" y="0" width="1" height="44" />
            </svg>
        </nav>
    );
}