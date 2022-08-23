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

        <div className='bold-line'></div>
          <div className='container'>
            <div className='window'>
              <div className='overlay'></div>
              <div className='content'>
                <div className='input-fields'>
                  <input type='text' placeholder='Username' className='input-line full-width'></input>
                  <input type='email' placeholder='Email' className='input-line full-width'></input>
                  <input type='password' placeholder='Password' className='input-line full-width'></input>
                </div>
                <div className='spacing'>or continue with <span className='highlight'>Facebook</span></div>
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
