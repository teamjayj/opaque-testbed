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
        <title>POTLS Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Register
        </h1>

        <p className={styles.description}>
        Please fill in this form to create an account.
        </p>

        <div className={'styles.bold-line'}></div>
          <div className={styles.containers}>
            <div className={styles.window}>
              <div className={styles.overlay}></div>
              <div className={styles.content}>
                <div className='input-fields'>
                  <input type='text' placeholder='Username' className='input-line full-width'></input>
                  <input type='password' placeholder='Password' className='input-line full-width'></input>
                </div>
                <div className={styles.spacing}>Already have an account? Click here to<span className='highlight'>Login</span></div>
                <div><button className='ghost-round full-width'>Create Account</button></div>
              </div>
            </div>
          </div>
      </main>
      
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> 
    </div>
    </React.Fragment>
  )
}

export default Home