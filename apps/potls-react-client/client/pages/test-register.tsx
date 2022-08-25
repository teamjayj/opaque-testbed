import Head from 'next/head'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import React from 'react';

class App extends React.Component{
    state = {
        uname: '',
        pwd: ''
    }

    handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const user = { 
            uname: this.state.uname, 
            pwd: this.state.pwd
        }

        axios.post("http://localhost:6969/register", { user })
        .then((res) => {
            console.log(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }
    
    handleChangeUname = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
            this.setState({ 
                uname: e.target.value
            });
    }
 
    handleChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
            this.setState({ 
                pwd: e.target.value
            });
    }

    render () {
        return (
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
                            <form id="form" onSubmit={this.handleSubmit}>
                                <input type='text' placeholder='Username' className={styles.inputline}
                                name="uname" value={this.state.uname} onChange={this.handleChangeUname}></input>
                                
                                <input type='password' placeholder='Password' className={styles.inputline}
                                id="pwd" name="pwd" value={this.state.pwd} onChange={this.handleChangePwd}></input>
                                
                                <div className={styles.spacing}>or click here to <a className={styles.facebook} href="register.tsx">register</a></div>
                                
                                <button type="submit" className={styles.button1}>Login</button>
    
                            </form>
                        </div>
                    </main>
                </div>
            </React.Fragment>
        )
    }
}

export default App