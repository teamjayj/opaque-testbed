import Head from "next/head";
import axios from "axios";
import styles from "../styles/Home.module.css";
import React from "react";
import { createClient } from "@teamjayj/opaque-axios-client";
import { OpaqueCloudflareClientDriver } from "@teamjayj/opaque-cloudflare-driver";
import { OpaqueCipherSuite } from "@teamjayj/opaque-core";

class App extends React.Component {
    state = {
        username: "",
        password: "",
    };

    handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const opaqueClient = await createClient(axios.create(), {
                driver: new OpaqueCloudflareClientDriver(
                    OpaqueCipherSuite.P256_SHA256
                ),
                server: {
                    id: "server-id",
                    hostname: "http://localhost:3101",
                },
            });

            const success = await opaqueClient.login(
                this.state.username,
                this.state.password
            );

            if (success) {
                confirm("User Successfully Login");
            }
        } catch (error) {
            confirm("Failed to login user");
            console.log(error);
        }
    };

    handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        this.setState({
            username: event.target.value,
        });
    };

    handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        this.setState({
            password: event.target.value,
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className={styles.container}>
                    <Head>
                        <title>OPAQUE Login</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>

                    <main className={styles.main_login}>
                        <h1 className={styles.title}>
                            OPAQUE <a>Login</a>
                        </h1>

                        <p className={styles.description}>
                            Log in to an account using OPAQUE
                        </p>

                        <div className={styles.textboxes}>
                            <form id="form" onSubmit={this.handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className={styles.inputline_login}
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.handleChangeUsername}
                                ></input>

                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={styles.inputline_login}
                                    id="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChangePassword}
                                ></input>

                                <button
                                    type="submit"
                                    className={styles.button2}
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </main>
                </div>
            </React.Fragment>
        );
    }
}

export default App;
