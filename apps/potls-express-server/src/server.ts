import app from "./app";

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(
        `PoTLS express server is listening to port ${port} with env: ${process.env.NODE_ENV}`
    );
});
