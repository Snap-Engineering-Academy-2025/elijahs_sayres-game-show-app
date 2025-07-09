import { useState } from 'react'
import './App.css'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '@mui/material/Modal';



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


// (FUTURE FEATURES)
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
// e.g. 0 -> 0 views, 30 -> 500,000 views,

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

  // Variables:
  const requestOptions = {method: 'GET',
                           // key for YouTube API
                          redirect: "follow"
  }

  const INITIAL_SCORE = 0; // Initial score
  // State variables:
  const [score, setScore] = useState(INITIAL_SCORE);
  const [lives, setLives] = useState(3);
  const [randomVideoIndex, setRandomVideoIndex] = useState(Math.floor(Math.random() * 50));
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [sliderValue, setSliderValue] = useState(0);
  const handleSliderChange = (event, newValue) => {
    setSliderValue(valueMap[newValue] || 0);
  };

  const [categories, setCategories] = useState([23, "Comedy"]); // A small array for the currently selected category [Category ID, Category Name]
  const [arrayCategories, setArrayCategories] = useState([]); // Stores the Categories in a array from API
  const [videoInfo, setVideos] = useState([]);
 
  
  
  // Function to generate a random color for the Change categories buttons 
  function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }


  // Function to check if the guess is correct based on the slider value
  // (Checks how close the guess is to the actual view count)
  function findCloestViewCount(target) {
    const sliderOptions = Object.values(valueMap);
    let closest = sliderOptions[0];
  
    for (let i = 1; i < sliderOptions.length; i++) {
      const currentDistance = Math.abs(sliderOptions[i] - target);
      const closestDistance = Math.abs(closest - target);
      if (Math.abs(currentDistance) < closestDistance) {
        closest = sliderOptions[i];
      }
    }
    return closest
  }




  // Main Function to fetch popular videos from YouTube API and categories
  async function fetchPopularVideos() {

    const videosUrl =
      "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=50&key=" +
      import.meta.env.VITE_YOUTUBE_KEY +"&videoCategoryId=" + categories[0];
    const categoriesUrl =
      "https://www.googleapis.com/youtube/v3/videoCategories?regionCode=US&key=" +import.meta.env.VITE_YOUTUBE_KEY;


      // gets a request for both a list of popular videos and a list of categories
    const [videoResponse, categoriesResponse] = await Promise.all([
      fetch(videosUrl, requestOptions),
      fetch(categoriesUrl, requestOptions),
    ]);

    const videosData = await videoResponse.json();
    const categoriesData = await categoriesResponse.json();

    setVideos([videosData?.items]);
    setRandomVideoIndex(Math.floor(Math.random() * 50));
    // if category can be assigned, keeps the category ID
    if (categoriesData?.items?.length) {setArrayCategories(
      categoriesData.items.filter(cat => cat.snippet?.assignable)
      .map(cat => ({ id: cat.id, title: cat.snippet.title }))
  );
}
  }



  // Runs on initial render and when categories change
  useEffect(() => {
  document.body.style.backgroundColor = "#1a1a1a";
  // call function if we have a API Key
  if (import.meta.env.VITE_YOUTUBE_KEY) {
    fetchPopularVideos();
  } else {
    console.error("YouTube API key is not set.");
  }
}, [categories]);






  return (
    <>
      <motion.h1 // The Header (the title with a small animation {on Hover changes the size of title slowly } and random color change)
        inital={{ opacity: 0, y: -20}}
        animate={{color: ["#ff0055","#ffcc00","#00ffcc","#0099ff","#ff0055"]}}
        transition={{ duration: 15, repeat: Infinity, ease:'linear' }}
        whileHover={{ scale: 1.1 }}
      >Guess That View Count!</motion.h1>
      <Grid container spacing={6} justifyContent="center" alignItems="center">
      <h2>Title of Video: {videoInfo[0]?.[randomVideoIndex]?.snippet?.title|| "Loading..."}</h2>
      <h2>Score: {score}</h2>
        <Grid justifyContent="center" alignItems="center" container spacing={6} >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "24px" }}>


            <iframe // YouTube video player (Eembedded video)
            src={"https://www.youtube.com/embed/" + videoInfo[0]?.[randomVideoIndex]?.id + "?autoplay=0&controls=1&start=0"}
            width={800}
            height={500}
            title={'YouTube video player'}
            ></iframe>

            <div 
                style={{
            maxWidth: "600px",
            overflowY: "auto",
            background: "#222",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
            minWidth: "200px",
            height: "500px", // match iframe height
            boxSizing: "border-box"
          }}>
            <Box>
            <h2>Channel Name: { videoInfo[0]?.[randomVideoIndex]?.snippet?.channelTitle || "Loading..."}</h2>
            <Button variant='contained' sx={{bgcolor: "#7a14f7"}} onClick={handleOpen}>Change Categories!</Button>


            <Button  // (Most of the games logic is in this button - (Checks if the guess is correct and updates the score/lives)
              variant='contained' sx={{bgcolor: "#f72314", marginLeft: "20px"}}
              onClick={() => {console.log(videoInfo[0]?.[randomVideoIndex]?.id ); if (findCloestViewCount(videoInfo[0]?.[randomVideoIndex]?.statistics?.viewCount) === sliderValue){
                setScore(score + 100);
                alert("Correct! The view count is " + videoInfo[0]?.[randomVideoIndex]?.statistics?.viewCount + " views!");
              }else{
                setLives(lives - 1);
                // prevents score from going below 0
                if(score <= 0){
                  setScore(0);
                } else{
                  setScore(score - 50);
                }
                
                if((lives - 1) <= 0){
                  alert("Game Over! You have no lives left. Your final score is " + score);
                  window.location.reload();
                }else{
                  alert("Wrong! The view count is " + videoInfo[0]?.[randomVideoIndex]?.statistics?.viewCount + " views! Your guess was " + sliderValue + " views. The closest value is " + findCloestViewCount(videoInfo[0]?.[randomVideoIndex]?.statistics?.viewCount) + " views.");
                }
              }setRandomVideoIndex(Math.floor(Math.random() * 50)) // sets a new random video index for the next guess
              }}>Submit Guess!</Button>


            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{position: 'absolute',
                justifyContent: 'right',
                top: '40%', left: '86%',
                transform: 'translate(-50%, -50%)',
                width: 300, bgcolor: '#615d5d', height: 550,
                boxShadow: 24, p: 4, borderRadius: 2}}
                >
              <Box justifyItems={"center"}>
                <Typography id="modal-modal-title" variant="h6" component="h2" >
                  Choose a Category!
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {arrayCategories.map((cat) => ( // maps through the categories and displays them as buttons in the modal 
          <Button
            key={cat.id}
            onClick={() => {
              setCategories([cat.id, cat.title]);
              handleClose(); // close modal after selection
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: getRandomColor(), // Sets a random color for each button in the Modal
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {cat.title}
          </Button>
        ))}
    </div>
            </Box>
          </Modal>
          </Box>

            <h2>Video Category: {categories[1] || ""}</h2>
            <h2>Lives : {lives}</h2>
            <p>Description: {videoInfo[0]?.[randomVideoIndex]?.snippet?.description || "'Description is not available for this video'"}</p>
            </div>
          </div>
        </Grid>
      </Grid>
      <Slider
        sx={{color: "#f72314", "& .MuiSlider-markLabel": {color: "#ffffff"}}}
        max={100}
        aria-label="Custom marks"
        defaultValue={0}
        step={null}
        getAriaValueText={value => `${valueMap[value] || 0} views`}
        valueLabelDisplay="off"
        onChange={handleSliderChange}
        marks={marks}
      />
      <p className="read-the-docs">
        Made by Elijah Sayres with <a href="https://vitejs.dev" target="_blank">Vite</a> + <a href="https://reactjs.org" target="_blank">React</a> + <a href="https://mui.com/material-ui/getting-started/overview/" target="_blank">Material UI</a>
      </p>
    </>
  )
}

export default App