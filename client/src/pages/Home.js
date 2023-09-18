import axios from 'axios'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useGetUserId } from '../hooks/useGetUserId'



const Home = ({ alertOpen, setAlertOpen, setAlertMessage }) => {
  const [ courseName, setCourseName ] = useState('')
  const [ courseInfo, setCourseInfo ] = useState(null)
  const [ reviews, setReviews ] = useState(null)
  const userId = useGetUserId()
  const [ cookies,  ] = useCookies(['access_token'])
  const [ errorMessage, setErrorMessage ] = useState(false)
  const [ reviewPage, setReviewPage ] = useState(1)
 // axios.defaults.withCredentials = true


  const [ reviewAverage, setReviewAverage ] = useState({
    rating: 0,
    difficulty: 0,
    enjoyability: 0,
    usefulness: 0,
    recommend: ''
  })

  const [ newReview, setNewReview ] = useState({
    courseName: '', //add course name when user submits review
    rating: 5,
    difficulty: 5,
    enjoyability: 5,
    usefulness: 5,
    teacher: '',
    recommend: '1',
    date: '', //add when user submits review
    comment: '',
    userOwner: userId
  })


  const handleChange = (event) => {
    event.preventDefault()
    setCourseName(event.target.value)
  }

  const reviewPageNext = () => {
    const maxPageNumber = Math.ceil(reviews.length / 5)
    if (reviewPage === maxPageNumber){return}
    setReviewPage(reviewPage + 1)
  }

  const reviewPagePrev = () => {
    const minPageNumber = 1
    if (reviewPage === minPageNumber){return}
    setReviewPage(reviewPage - 1)
  }

  const getReviews = async (courseName) => {
    try{
      const res = await axios.get(`https://course-helper-api.vercel.app/reviews/${courseName}`)
      setReviews(res.data)

      let rating = 0
      let difficulty = 0
      let enjoyability = 0
      let usefulness = 0
      let yesCount = 0
      let noCount = 0
      res.data.forEach((review) => {
        rating += review.rating
        difficulty += review.difficulty
        enjoyability += review.enjoyability
        usefulness += review.usefulness
        if (review.recommend === '1'){
          yesCount += 1
        } else {
          noCount += 1
        }
      })
      const overallRating = (rating / res.data.length).toFixed(2)
      const overallDifficulty = (difficulty / res.data.length).toFixed(2)
      const overallEnjoyability = (enjoyability / res.data.length).toFixed(2)
      const overallUsefulness = (usefulness / res.data.length).toFixed(2)
      let overallRecommend = ''
      if (yesCount > noCount){
        overallRecommend = 'Yes'
      } else if (yesCount < noCount){
        overallRecommend = 'No'
      } else {
        overallRecommend = 'Yes and No are Equal'
      }
      
      setReviewAverage({
        rating: overallRating,
        difficulty: overallDifficulty,
        enjoyability: overallEnjoyability,
        usefulness: overallUsefulness,
        recommend: overallRecommend
      })

    } catch (error) {
      console.error(error)
    }
  }

  const searchClass = async () => {
    const searchCourse = courseName.toUpperCase()
    try {
      const res = await axios.get(`https://course-helper-api.vercel.app/courses/${searchCourse}`)

      if (res.data.length === 0){
        setCourseInfo(null)
        setReviews(null)
        setErrorMessage(true)
      } else {
        getReviews(res.data[0].name)
        setCourseInfo(res.data[0])
        setErrorMessage(false)
        setReviewPage(1)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const keyDownHandler = event => {
      console.log('User pressed: ', event.key);
      if (event.key === 'Enter') {
        event.preventDefault()
        searchClass()
      }
    }
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  const handleReviewSliderChange = (event) => {
    const { name, value } = event.target
    const valueShower = document.querySelector(`.${name}`)
    valueShower.innerHTML = value
    setNewReview({...newReview, [name]: value}) 
  }

  const handleReviewChange = (event) => {
    const { name, value } = event.target
    setNewReview({...newReview, [name]: value}) 
  }

  const resetReview = () => {
    newReview.teacher = ''
    newReview.comment = ''
    newReview.rating = 5
    newReview.difficulty = 5
    newReview.enjoyability = 5
    newReview.usefulness = 5
    newReview.recommend = 1
    const ratingSpan = document.querySelector('.rating')
    const difficultySpan = document.querySelector('.difficulty')
    const enjoyabilitySpan = document.querySelector('.enjoyability')
    const usefulnessSpan = document.querySelector('.usefulness')
    ratingSpan.innerHTML = 5
    difficultySpan.innerHTML = 5
    enjoyabilitySpan.innerHTML = 5
    usefulnessSpan.innerHTML = 5
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (newReview.teacher === '' || newReview.comment === ''){
      // alert('You need to fill in all parts')
      setAlertMessage('You need to fill in all parts')
      setAlertOpen(true)
      return
    }
    const courseName = courseInfo.name
    newReview.courseName = courseName

    const timeElapsed = Date.now()
    const today = new Date(timeElapsed)
    const todayDate = today.toLocaleDateString()
    newReview.date = todayDate

    try{
      const res = await axios.post('https://course-helper-api.vercel.app/reviews', newReview, { headers: {authorization: cookies.access_token}})
      //alert(res.data.message)
      setAlertMessage(res.data.message)
      setAlertOpen(true)
      resetReview()
      searchClass()
    } catch (error) {
      console.error(error)
    }
  }



  return (
    <div className='home'>
      <div className='search-div'>
        <label className='search-label' htmlFor='search-course'>Search for Course</label>
        <input type='text' placeholder='Course Number' id='search-course' onChange={handleChange} value={courseName}/>
        <button className='submit-button' type='submit' onClick={searchClass}>Search</button>
      </div>
      
      
      { errorMessage && (
        <div>
          <h2>Searched Class Can't Be Found.</h2>
          <p>To add a class, login and go to the Add Class section</p>
        </div>
      )}

      {courseInfo && (
        <div className='course-info'>

          <div className='overall-course-info'>
            <div>
              <div>
                <h1>{courseInfo.name}</h1>
                <p>{courseInfo.description}</p>
              </div>
              
              <div>
                <h2>Prerequisites:</h2>
                {courseInfo.prerequisites.map((prereq, index) => (
                  <p key={index}>{prereq}</p>
                ))}
              </div>
            </div>

            <div className='overall-consensus'>
              <h2>Overall Consensus:</h2>
              {reviews && (
                <>
                {/* this part is for showing average review for the course */}
                {reviews.length > 0 && (
                  <>
                    <div>Rating: {reviewAverage.rating}</div>
                    <div>Difficulty: {reviewAverage.difficulty}</div>
                    <div>Enjoyability: {reviewAverage.enjoyability}</div>
                    <div>Usefulness: {reviewAverage.usefulness}</div>
                    <div>Overall Recommend: {reviewAverage.recommend}</div>
                  </>
                )}      
                {/* end of average review section */}
                </>
              )}
            </div>
          </div>
          
          

          <div className='review-big-container'>
            {reviews && (
            <>
              <div className='review-controls'>
                <h1>Reviews:</h1>
                <div className='arrows'>
                  <div onClick={reviewPagePrev}>&#8249;</div>
                  <div onClick={reviewPageNext}>&#8250;</div>
                </div>
              </div>
              
              <div className='reviews-div'>
                {reviews.slice((reviewPage - 1) * 5, (reviewPage - 1) * 5 + 5).map((review, index) => (
                  <div className='review-container' key={index}>
                    <div className='review-container-row1'>
                      <div>
                        <p>Overall Rating: {review.rating}</p>
                        <p>Difficulty: {review.difficulty}</p>
                        <p>Enjoyability: {review.enjoyability}</p>
                        <p>Usefulness: {review.usefulness}</p>
                      </div>
                      <div>
                        <p>Professor: {review.teacher}</p>
                        <p>Recommend?: {
                          review.recommend === '1' ? 'Yes' : 'No'}
                        </p>
                        <p>Date: {review.date}</p>
                      </div>
                    </div>
                      
                    <p className='comment-box'>Comment: {review.comment}</p>
                  </div>
                ))} 
              </div>
            </>
            ) 
            }

            {cookies.access_token && (
              <div className='add-review'>
                <h2>Add Review</h2>
                <form onSubmit={onSubmit} className='review-form'>
                  <label htmlFor='rating'>Overall Rating:</label>
                  <span className='rating'>5</span>
                  <input className='slider' id='rating' name='rating' type="range" min="0" max="10" onChange={handleReviewSliderChange} value={newReview.rating}/>

                  <label htmlFor='difficulty'>Difficulty:</label>
                  <span className='difficulty'>5</span>
                  <input className='slider' id='difficulty' name='difficulty' type="range" min="0" max="10" onChange={handleReviewSliderChange} value={newReview.difficulty}/>

                  <label htmlFor='enjoyability'>Enjoyability:</label>
                  <span className='enjoyability'>5</span>
                  <input className='slider' id='enjoyability' name='enjoyability' type="range" min="0" max="10" onChange={handleReviewSliderChange} value={newReview.enjoyability}/>

                  <label htmlFor='usefulness'>Usefulness:</label>
                  <span className='usefulness'>5</span>
                  <input className='slider' id='usefulness' name='usefulness' type="range" min="0" max="10" onChange={handleReviewSliderChange} value={newReview.usefulness}/>

                  <label htmlFor='teacher'>Professor Name</label>
                  <input type='text' id='teacher' name='teacher' onChange={handleReviewChange} value={newReview.teacher}/>

                  <label htmlFor='recommend'>Recommend?</label>
                  <div className='rec-slider-div'>
                    <span>No</span>
                    <input className='recommend-slider' id='recommend' name='recommend' type="range" min="0" max="1" onChange={handleReviewChange} value={newReview.recommend}/>
                    <span>Yes</span>
                  </div>
                  
          
                  <label htmlFor='comment'>Comment</label>
                  <textarea id='comment' name='comment' maxLength='600' onChange={handleReviewChange} value={newReview.comment}></textarea>
          
                  
                  <button className='submit-button' type='submit'>
                    Add Review
                  </button>
                </form>
              </div>)
            }
          </div>
           

        </div>
        ) 
      }

    </div>
  )
}

export default Home
