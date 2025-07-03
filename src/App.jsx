import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';



/*
TO DO:
first check if the API key works
Have a embedded YouTube video in the app where only the first 10-15 seconds are played (view count is not shown)
then fetch the view count of a YouTube video
then add a button to reset/play again the game (maybe 10 guesses then button appears and a soft reset button in the corner)
then a slider to guess the view count
      * then display the view count after the guess
then add a button to guess the view count

then check if the guess is correct and display a message ( maybe a jokes if the guess is wrong (there is a free jokes API for this))
      * if 3 guesses are wrong, have a "double or nothing" button that will double the score if the guess is correct, but reset it by half if wrong
            * instead of viewer count check, will ask for the number of likes on the same video

then add a timer to make it more challenging (start the timer after the video is fully played or paused)
then add a leaderboard to keep track of scores - (names will be asked on page load)


For Video Cataegory: I want it to show the category of the video (e.g. Music, Gaming, etc.)
      * this will be done by fetching the video details from the YouTube API and displaying the category
         * Basically this needs to be its own commponent that fetches the all the categories and displays them in fun buttons which change the variable for the video category

*/

const marks = [
  { value: 0, label: '0' },
  { value: 10, label: '10K' },
  { value: 20, label: '100K' },
  { value: 30, label: '500K' },
  { value: 40, label: '1M' },
  { value: 50, label: '5M' },
  { value: 60, label: '10M' },
  { value: 70, label: '50M' },
  { value: 80, label: '100M' },
  { value: 90, label: '500M' },
  { value: 100, label: '1B' },
];

// this is the value map for the slider marks
// it maps the slider value to the actual view count
// e.g. 0 -> 0 views, 7 -> 1000 views,

const valueMap = {
  0: 0,
  10: 10000,
  20: 100000,
  30: 500000,
  40: 1000000,
  50: 5000000,
  60: 10000000,
  70: 50000000,
  80: 100000000,
  90: 500000000,
  100: 1000000000,
};



function App() {
  const [count, setCount] = useState(0)
  // git test comment (# 2)

  const requestOptions = {method: 'GET',
                           // key for YouTube API
                          redirect: "follow"
  }

  // basically, I need a function that fetches the view count of a YouTube video
  // but this first needs to check if it my API key even works and it sends a request and print the respnse to the console




  return (
    <>
      <h1>Guess That View Count!</h1>
      <Grid container spacing={6} justifyContent="center" alignItems="center">
      <h2>Title of Video: </h2>
      <h2>Score: </h2>
      <h2>Video Category: </h2>

        <Grid justifyContent="center" alignItems="center" container spacing={6}>
          <iframe
          src={"https://www.youtube.com/embed/bHQqvYy5KYo"}
          width={800}
          height={500}
          title={'YouTube video player'}
          ></iframe>

          <Button variant='contained'>Change Categories!</Button>
        </Grid>
      </Grid>
      <Slider
        max={100}
        aria-label="Custom marks"
        defaultValue={0}
        getAriaValueText={value => `${valueMap[value] || 0} views`}
        valueLabelDisplay="auto"
        //valueLabelFormat={value => `${valueMap[value]} views`}
        marks={marks}
      />
  
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Made by Elijah Sayres with <a href="https://vitejs.dev" target="_blank">Vite</a> + <a href="https://reactjs.org" target="_blank">React</a> + <a href="https://mui.com/material-ui/getting-started/overview/" target="_blank">Material UI</a>
      </p>
    </>
  )
}

export default App
