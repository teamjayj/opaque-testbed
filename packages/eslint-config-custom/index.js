module.exports = {
    extends: ["next", "turbo", "prettier"],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
        "react/jsx-key": "off",
        "import/no-anonymous-default-export": [
            "error",
            {
                allowAnonymousFunction: true,
            },
        ],
    },
};
