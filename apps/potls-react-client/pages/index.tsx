import Head from "next/head";
import axios, { AxiosError, AxiosResponse } from "axios";
import styles from "../styles/Home.module.css";
import React from "react";

class App extends React.Component {
    state = {
        username: "",
        password: "",
    };

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password,
        };

        axios
            .post("http://localhost:3100/register", user)
            .then((res: AxiosResponse) => {
                if (res.status === 200) {
                    if (confirm("User Successfully Registered")) {
                        window.location.reload();
                    }
                }
            })
            .catch((error: AxiosError) => {
                const { message: errorMessage }: any = error.response?.data;
                confirm("Failed to register user");
            });
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
                        <title>PoTLS Registration</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>

                    <main className={styles.main}>
                        <h1 className={styles.title}>PoTLS Registration</h1>

                        <p className={styles.description}>
                            Register an account using Password-over-TLS
                        </p>

                        <div className={styles.textboxes}>
                            <form id="form" onSubmit={this.handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className={styles.inputline}
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.handleChangeUsername}
                                ></input>

                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={styles.inputline}
                                    id="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChangePassword}
                                ></input>

                                <button
                                    type="submit"
                                    className={styles.button1}
                                >
                                    Register
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
