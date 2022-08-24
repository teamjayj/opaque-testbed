import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'

const Home: NextPage = () => {
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
            <form action="/register" method="POST">
              <input type='text' placeholder='Username' className={styles.inputline} id="uname" name="uname"></input>
              <input type='password' placeholder='Password' className={styles.inputline} id="pwd" name="pwd"></input>
            <div className={styles.spacing}>or click here to <a className={styles.facebook} href="register.tsx">register</a></div>
            <button className={styles.button1}>Login</button>
            </form>
          </div>
      </main>
      
      
    </div>
    </React.Fragment>
  )
}

export default Home