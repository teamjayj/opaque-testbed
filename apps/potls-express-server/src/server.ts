import { createApp } from "./app";

const port = process.env.PORT || 8000;

const userDatabase: Map<string, string> = new Map();

createApp(userDatabase).listen(port, () => {
    console.log(
        `PoTLS express server is listening to port ${port} with env: ${process.env.NODE_ENV}`
    );
});
