/** @type {import("tailwindcss").Config} */
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

module.exports = {
    content: [
        "./app/**/*.{ts,tsx,js,jsx}",
        "./components/**/*.{ts,tsx,js,jsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#1d4ed8",
                    dark: "#1e3a8a",
                    light: "#3b82f6",
                },
                accent: "#0ea5e9",

                background: {
                    DEFAULT: "#f8fafc",
                    card: "#ffffff",
                    hover: "#f1f5f9",
                },

                text: {
                    primary: "#0f172a",
                    secondary: "#475569",
                    muted: "#64748b",
                },

                border: "#e2e8f0",

                success: "#22c55e",
                warning: "#f59e0b",
                danger: "#ef4444",
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
        },
    },

    plugins: [
        forms,
        typography,
    ],
};
