import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
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
          Hello there!
        </h1>

        <p className={styles.description}>
        We're almost done. Before using our services you need to create an account.
        </p>

        
          <div className={styles.textboxes}>
            
           
              <input type='text' placeholder='Username' className={styles.inputline}></input>
              <input type='password' placeholder='Password' className={styles.inputline}></input>
            
            <div className={styles.spacing}>or continue with <a className={styles.facebook} href="www.facebook.com">Facebook</a></div>
            <button className={styles.button1}>Create Account</button>
              
          </div>
      </main>
      
      
    </div>
    </React.Fragment>
  )
}

export default Home
