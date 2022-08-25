import Head from 'next/head'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import React from 'react'
import e, { response } from 'express'

export default class App extends React.Component<{}, State>{

    state = { 
        uname: '',
        pwd: ''
    }

    handleSubmit = (event: { preventDefault: () => void }) => {

        event.preventDefault()

        const users = { uname: this.state.uname }
        const pwd = { pwd: this.state.pwd }

        axios.post('http://localhost:6969/register', { users, pwd })
        .then((res) => {
            console.log(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    onChangeUname(e) {
        this.setState({ uname: e.target.value })
    }

    onChangePwd(e) {
        this.setState({ pwd: e.target.value })
    }

    render () {
        <React.Fragment>
            <div className={styles.container}>
                <Head>
                    <title>POTLS Login</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Login
                    </h1>

                    <p className={styles.description}>
                        Please fill in this form to access the system.
                    </p>

                    
                    <div className={styles.textboxes}>
                        <form id="form" onSubmit={this.handleSubmit} method="POST">
                            <input type='text' placeholder='Username' className={styles.inputline}
                            name="uname" value={this.state.uname}></input>
                            
                            <input type='password' placeholder='Password' className={styles.inputline}
                            id="pwd" name="pwd" value={this.state.pwd}></input>
                            
                            <div className={styles.spacing}>or click here to <a className={styles.facebook} href="register.tsx">register</a></div>
                            
                            <button type="submit" className={styles.button1}>Login</button>

                        </form>
                    </div>
                </main>
            </div>
        </React.Fragment>
    }
}