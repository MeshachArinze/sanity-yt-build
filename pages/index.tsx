import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className=''>
        <div className='pt-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'>
            <span className='underline decoration-black decoration-4'>
              Medium
            </span>
            is a place to write, read and correct
          </h1>
          <h2>Its easy and free to post your thinking on any topic and correct millions readers</h2>
        </div>
        <img className='hidden md:inline-flex h032 lg-h-full' src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt="" />
      </div>
    </div>
  )
}

export default Home
