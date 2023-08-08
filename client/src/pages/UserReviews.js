import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useGetUserId } from '../hooks/useGetUserId'



const UserReviews = () => {
  const [ reviews, setReviews ] = useState(null)
  const userId = useGetUserId()
  const [ reviewPage, setReviewPage ] = useState(1)


  useEffect(() => {
    const getReviews = async () => {
      try{
        const res = await axios.get(`https://course-helper-api.vercel.app/reviews/ids/${userId}`)
        setReviews(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    getReviews()

  }, [])

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



  return (
    <div className='user-reviews'>
      

     {reviews && (
        <>
          <div className='arrows'>
              <div onClick={reviewPagePrev}>&#8249;</div>
              <div onClick={reviewPageNext}>&#8250;</div>
          </div>
          <div className='reviews-div'>
            {reviews.slice((reviewPage - 1) * 5, (reviewPage - 1) * 5 + 5).map((review, index) => (
              <div className='review-container' key={index}>
                <div className='review-container-row1'>
                  <div>
                    <p>Course: {review.courseName}</p>
                    <p>Professor: {review.teacher}</p>
                    <p>Recommend?: {
                        review.recommend === '1' ? 'Yes' : 'No'}
                    </p>
                    <p>Date: {review.date}</p>
                  </div>
                  <div>
                    <p>Overall Rating: {review.rating}</p>
                    <p>Difficulty: {review.difficulty}</p>
                    <p>Enjoyability: {review.enjoyability}</p>
                    <p>Usefulness: {review.usefulness}</p>
                  </div>
                </div>
                
                <p className='comment-box'>Comment: {review.comment}</p>
              </div>
            ))} 
          </div>
        </>
        ) 
      }

    </div>
  )
}

export default UserReviews
